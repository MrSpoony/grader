const util = require("util");
const exec = util.promisify(require("child_process").exec);

const fs = require("fs");
const models = require("@lib/server");
const { Submission, Task, Testgroup, Testcase, TestcaseStatus } = models.default;

const gppflags = "";

export default async function handler(req, res) {
    const {
        body: { user_id, code, task_id },
        method,
    } = req;
    if (method === "POST") {
        fs.writeFile("submission.cpp", code, (err) => {
            if (err) {
                res.status(500).json({ message: err || "Something went wrong while storing the file"});
            }
        });
        let { stdout: path } = await exec("pwd");
        const file = path.trim() + "/submission";
        path = path.trim() + "/submission.cpp";
        let compilation = 1;
        try {
            const { stderr } = await exec("g++ " + gppflags + " " + path + " -o " + file);
            if (stderr.trim() !== "") compilation = 2;
        } catch (e) {
            compilation = 3;
        }
        const response = await Submission.create({ user_id, compilation, code, task_id });
        res.status(200).json(response);
        evaluateSubmission(task_id, response.id, file);
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}


const evaluateSubmission = async (task_id, submission_id, file) => {
    const everything = await Task.findOne({include: [
        { model: Testgroup, as: "testgroups" },
    ], where: { id: task_id } });
    for (let testgroup of everything["testgroups"]) {
        const realTestgroup = await Testgroup.findOne({include: [
            { model: Testcase, as: "testcases"}
        ], where: { id: testgroup.id }});
        for (let testcase of realTestgroup["testcases"]) {
            let stdout;
            let stderr;
            try {
                const command = "echo '" + testcase.input + " ' | " +  file;
                console.log("Command: " + command);
                const cmd = await exec(command);
                stdout = cmd.stdout;
                stderr = cmd.stderr;
                if (stderr.trim() !== "") {
                    break;
                }
            } catch (e) {
                console.log("RE");
                TestcaseStatus.create({ status_id: 4, testcase_id: testcase.id, submission_id});
                break;
            }
            if (stdout.trim() !== testcase.output.trim()) {
                console.log("Actual: " + stdout.trim());
                console.log("WA");
                console.log("Expected: " + testcase.output.trim());
                TestcaseStatus.create({ status_id: 5, testcase_id: testcase.id, submission_id});
            } else {
                console.log("Success");
                TestcaseStatus.create({ status_id: 1, testcase_id: testcase.id, submission_id});
            }
        }
    }
};
