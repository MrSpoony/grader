const util = require("util");
const exec = util.promisify(require("child_process").exec);
const models = require("./server");
const {
    Submission,
    Testcase,
    Task,
    Testgroup,
    TestcaseStatus,
    Testgrouptype
} = models.default;
const fs = require("fs");

const writeCodeInFile = util.promisify(fs.writeFile);

const gppflags = "-Wall -Wextra -fdiagnostics-color=never " +
                 "-Wno-sign-compare -std=c++20 -O2 -static ";
let submission;
let code = "";
let task_id = 0;

const loadStuff = async () => {
    submission = await Submission.findByPk(process.argv[2]);
    code = submission.code;
    task_id = submission.task_id;
};

const compile = async () => {
    try {
        await writeCodeInFile("submission.cpp", code);
    } catch (e) {
        throw new Error(e.message);
    }
    let { stdout: cwd } = await exec("pwd");
    const executable = cwd.trim() + "/submission";
    const source = cwd.trim() + "/submission.cpp";
    let compilationStatus = 1;
    let compilationTxt = "";
    try {
        const {
            stderr: compilationText
        } = await exec("g++-10 " + gppflags + " " + source + " -o " + executable);
        if (compilationText.trim() !== "") {
            compilationTxt = compilationText.trim();
            compilationStatus = 2;
        }
    } catch (e) {
        compilationStatus = 3;
        compilationTxt = e.stderr;
    }
    try {
        submission.compilation_status = compilationStatus;
        submission.compilation_text = compilationTxt;
        await submission.save();
        await evaluateSubmission(task_id, submission, executable);
    } catch (e) {
        throw new Error(e.message);
    }
};

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
            submission_id,
            output: stdout.trim()
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
            { model: Testcase, as: "testcases" },
            { model: Testgrouptype, as: "testgrouptype" },
        ], where: { id: testgroup.id }
    });
    let numberOfRights = 0;
    for (let testcase of realTestgroup["testcases"]) {
        const result = await evaluateTestcase(testcase, file, submission_id);
        if (result !== 1 && realTestgroup.testgrouptype.type !== "sample") {
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
    await submission.save();
};

const main = async () => {
    await loadStuff();
    await compile();
};


main();
