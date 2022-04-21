const util = require("util");
const exec = util.promisify(require("child_process").exec);
import config from "@lib/sessionConfig";
const { withIronSessionApiRoute } = require("iron-session/next");
const fs = require("fs");
const models = require("@lib/server");
const {
    Submission,
    Task,
    Testgroup,
    Testcase,
    TestcaseStatus
} = models.default;

export default withIronSessionApiRoute(handler, config);

const writeCodeInFile = util.promisify(fs.writeFile);

// eslint-disable-next-line max-len
const gppflags = "-Wall -Wextra -fdiagnostics-color=never -Wno-sign-compare -std=c++20 -O2 -static";

export async function handler(req, res) {
    if (!req.session || !req.session.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const {
        body: { code, task_id },
        session: { user },
        method,
    } = req;
    if (method === "POST") {
        try {
            await writeCodeInFile("submission.cpp", code);
        } catch (e) {
            res.status(500).json({message: e.message});
        }
        let { stdout: cwd } = await exec("pwd");
        const executable = cwd.trim() + "/submission";
        const source = cwd.trim() + "/submission.cpp";
        let compilationStatus = 1;
        let compilationText = "";
        try {
            const {
                stderr: compilationText
            // eslint-disable-next-line max-len
            } = await exec("g++-10 " + gppflags + " " + source + " -o " + executable);
            if (compilationText.trim() !== "") compilationStatus = 2;
        } catch (e) {
            compilationStatus = 3;
            compilationText = e.stderr;
        }
        try {
            const submission = await Submission.create({
                user_id: user.id,
                task_id,
                compilation_status: compilationStatus,
                compilation_text: compilationText,
                code,
                verdict: 8,
                score: 0
            });
            res.status(200).json(submission);
            await evaluateSubmission(task_id, submission, executable);
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}


const evaluateTestcase = async (testcase, file, submission_id) => {
    let stdout;
    let stderr;
    try {
        const command = "echo '" + testcase.input + " ' | " + file;
        console.log("Command: " + command);
        const cmd = await exec(command);
        stdout = cmd.stdout;
        stderr = cmd.stderr;
        if (stderr.trim() !== "") {
            console.log("RE");
            await TestcaseStatus.create({
                status_id: 4,
                testcase_id: testcase.id,
                submission_id
            });
            return 4;
        }
    } catch (e) {
        console.log("RE");
        await TestcaseStatus.create({
            status_id: 4,
            testcase_id: testcase.id,
            submission_id
        });
        return 4;
    }
    if (stdout.trim() !== testcase.output.trim()) {
        console.log("Actual: " + stdout.trim());
        console.log("WA");
        console.log("Expected: " + testcase.output.trim());
        await TestcaseStatus.create({
            status_id: 5,
            testcase_id: testcase.id,
            submission_id
        });
        return 5;
    }
    console.log("Success");
    await TestcaseStatus.create({
        status_id: 1,
        testcase_id: testcase.id,
        submission_id
    });
    return 1;
};


const evaluateTestgroup = async (testgroup, file, submission_id) => {
    const realTestgroup = await Testgroup.findOne({
        include: [
            { model: Testcase, as: "testcases" }
        ], where: { id: testgroup.id }
    });
    let numberOfRights = 0;
    for (let testcase of realTestgroup["testcases"]) {
        const result = await evaluateTestcase(testcase, file, submission_id);
        if (result !== 1) {
            return result;
        }
        numberOfRights++;
    }
    if (numberOfRights != realTestgroup["testcases"].length) return 5;
    else return 1;
};


const evaluateSubmission = async (task_id, submission, file) => {
    const task = await Task.findOne({
        include: [
            { model: Testgroup, as: "testgroups" },
        ], where: { id: task_id }
    });
    submission.verdict = 1;
    submission.score = 0;
    for (let testgroup of task["testgroups"]) {
        const result = await evaluateTestgroup(testgroup, file, submission.id);
        if (result !== 1) {
            submission.verdict = result;
        } else {
            submission.score += testgroup.points;
        }
    }
    submission.save();
};
