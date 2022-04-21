const util = require("util");
const exec = util.promisify(require("child_process").exec);
import config from "@lib/sessionConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, config);

const fs = require("fs");
const models = require("@lib/server");
const { Submission, Task, Testgroup, Testcase, TestcaseStatus } = models.default;

const gppflags = "";

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
        fs.writeFile("submission.cpp", "", err => {
            if (err) res.status(500).json({
                message: err ||
                    "Something went wrong while storing the file"
            });
            return;
        });
        fs.writeFile("submission.cpp", code, err => {
            if (err) {
                res.status(500).json({
                    message: err ||
                        "Something went wrong while storing the file"
                });
                return;
            }
        });
        let { stdout: cwd } = await exec("pwd");
        const executable = cwd.trim() + "/submission";
        const source = cwd.trim() + "/submission.cpp";
        let compilationStatus = 1;
        let compilationText = "";
        try {
            const {
                stderr: compilationText
            } = await exec("g++ " + gppflags + " " + source + " -o " + executable);
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
                score: 0
            });
            res.status(200).json(submission);
            await evaluateSubmission(task_id, submission, executable);
        } catch (e) {
            res.status(500).json({
                message: e ||
                    "Something went wrong while creating the submission"
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
            return false;
        }
    } catch (e) {
        console.log("RE");
        await TestcaseStatus.create({
            status_id: 4,
            testcase_id: testcase.id,
            submission_id
        });
        return false;
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
        return false;
    }
    console.log("Success");
    await TestcaseStatus.create({
        status_id: 1,
        testcase_id: testcase.id,
        submission_id
    });
    return true;
};


const evaluateTestggroup = async (testgroup, file, submission_id) => {
    const realTestgroup = await Testgroup.findOne({
        include: [
            { model: Testcase, as: "testcases" }
        ], where: { id: testgroup.id }
    });
    let numberOfRights = 0;
    for (let testcase of realTestgroup["testcases"]) {
        const result = evaluateTestcase(testcase, file, submission_id);
        if (!result) break;
        numberOfRights++;
    }
    if (numberOfRights != realTestgroup["testcases"].length) return false;
    else return true;
};


const evaluateSubmission = async (task_id, submission, file) => {
    const task = await Task.findOne({
        include: [
            { model: Testgroup, as: "testgroups" },
        ], where: { id: task_id }
    });
    submission.score = 0;
    for (let testgroup of task["testgroups"]) {
        const result = evaluateTestggroup(testgroup, file, submission.id);
        if (result) submission.score += testgroup.points;
    }
    submission.save();
};
