const { exec } = require("child_process");
import config from "@lib/sessionConfig";
const { withIronSessionApiRoute } = require("iron-session/next");
const models = require("@lib/server");
const { Submission } = models.default;

export default withIronSessionApiRoute(handler, config);


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
        let submission = await Submission.create({
            user_id: user.id,
            task_id,
            compilation_status: 8,
            compilation_text: "",
            code,
            verdict: 8,
            score: 0
        });
        res.status(200).json(submission);
        exec(`node lib/execute.js ${submission.id}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
