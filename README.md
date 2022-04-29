# Grader

## Abstract

This project is heavily inspired from the [SOI](https://soi.ch/)
(Swiss olympiad in informatics) Grader, which can be found on the Website
[soi.grader.ch/training](https://grader.soi.ch/). The SOI grader is there to
view some Competitive Programming problems, solve them, and then upload your code.
The grader then compiles and exeutes that code for you, and you can see
and compare your results.

I tried to make my own version of this grader, which turned out to be a rather
big project to make in just seven days. I managed to get the most important features
to work but some features are still missing.


## Conclusion

I was very excited to do this project and also knew in advance
what I wanted to make. Then I realized, that I obviously first had
to write the backend to code my frontend. The problem with this was,
that in the end I focused more on the backend and the database
rather than the frontend and it should've been a frontend project.

This isn't that big of a problem, because I like programming the logic
more than the styling of a page. So I enjoied programming the whole procjet much.

I also think that my final product is ok, it could definitely be better
but with the available time I had, I think the final product is very acceptable.


## Feature List

You can:

* [x] Register as a new user.
* [x] Login as an existing user.
* [x] Look at an overview of all the tasks.
* [x] Look at a detailed page of a task with time limits and sample cases.
* [x] Submit code.
* [x] Let the grader evaluate your code.
* [x] See the results the evaluation.
* [x] See all your submissions with the associated scores and messages.
* [x] As a leader/admin see all the Submissions of all participants.
* [x] Let a leader/admin change your score.
* [x] Let a leader/admin delete one of your submissions.

## Testcases

### T-01

#### Prerequisites

* Functional Workstation (Internet, Monitor, Mouse, Keyboard, PC etc.)
* GIT with a rather new version.
* Newest version of NodeJS is installed and working.
* WSL 1 or 2 installed

#### Procedure

1. The tester clones the git repository `git clone https://git.bbcag.ch/inf-bl/be/2021/wf/team-h/kimi-l-ffel/grader.git`
3. The tester opens the project folder in the wsl.
4. The tester runs `npm install --force` in the terminal.

#### Expected result

After the command was executed the installation of the packages should start,
it is ok, when some warnings pop up but there should definitely be no error.

### T-02

#### Prerequisites

* T-01

#### Procedure

1. The tester opens the project folder in the terminal (whereever npm is installed).
2. The tester changes line 4 in file `lib/server.js` to where the mysql server runs (If it's your host machine enter the IP of your host machine)
3. The tester creates a mysql user `grader` with the password `graderuserpassword`.
4. The tester runs the `lib/database/database.sql` file with the above mysql configuration.
5. The tester runs `npm run dev`.

#### Expected result

After the command was executed the next server should be started.
There should be no errors.

### T-03

#### Prerequisites

* T-02

#### Procedure

1. The tester open his Browser of choice (Supported are: Firefox and Chromium based browsers) with all cookies cleared.
2. The tester enters the IP Address where the server was started
(if it's the same machine enter `localhost`) with Port 3000 so append `:3000` to the IP Address.


#### Expected result

The grader website opens without any errors.

There is a Navbar at the top of the screen, you should see the title `Tasks:`.

The navbar should have a Login Link at the right of the screeen.


### T-04

#### Prerequisites

* T-03

#### Procedure

1. The testes opens the browser on the homepage but adds `/api/insertdata` to the URL.

#### Expected result

There should be a text saying `"message": "Everyting is created!"`.


### T-05

#### Prerequisites

* T-04

#### Procedure

1. The tester opens the homepage again.
2. Clicks on the `Login` Link at the top right.
3. Tries to log in with some random credentials.

#### Expected result

There should appear a red message saying, that the username/email he entered
does not exist.


### T-06

#### Prerequisites

* T-05

#### Procedure

1. The tester opens the homepage again.
2. Clicks on the `Login` Link at the top right.
3. Clicks on the `here` Link in `Create one here` in the middle of the screen.
4. The tester tries to create a user.

#### Expected result

When given all the information to the form, clicking on `Register` should
pop up a loading screen. After some time this dialog should disappear and you
should be redirected to the login page.


### T-07

#### Prerequisites

* T-06

#### Procedure

1. The tester logs himself in with the credentials he made in `T-06`

#### Expected result

After clicking on `Login` there should popup a loading Alert, which disappears after
a short time. The user should be redirected to the Homepage and should be logged in.
This can be checked by looking in the top right corner, if there is your username,
everything is fine.


### T-08

#### Prerequisites

* T-07

#### Procedure

1. The tester clicks on a task,
2. Reads the information given,
3. Clicks submit,
4. Uploads a file which gives the wrong answer to the problem but compiles,
5. Selects the task he wants to submit for,
6. Clicks submit

#### Expected result

After clicking submit the second time, the user should get redirected to
a detail page where the information should slowly appear one after another.

Because the submitted file should give the wrong answer everywhere all the
Badges except the `Compilation` one should be red and have the text `WA` in them.


### T-09

#### Prerequisites

* T-07

#### Procedure

1. The tester clicks on a task,
2. Reads the information given,
3. Clicks submit,
4. Uploads a file which gives the right answer to the problem,
5. Selects the task he wants to submit for,
6. Clicks submit

#### Expected result

After clicking submit the second time, the user should get redirected to
a detail page where the information should slowly appear one after another.

Because the submitted file should give the right answer everywhere all the
Badges should be green and have the text `Success` in them.


### T-10

#### Prerequisites

* T-08
* T-09

#### Procedure

1. The tester clicks on `Submissions` in the Navbar.

#### Expected result

After a short loading time, both of the submissions should appear.

All the information should be correct and the `Details` Link should lead you to the
previous Detail page.


### T-11

#### Prerequisites

* T-03

#### Procedure

1. The testes opens the browser on the homepage but adds `/api/deletedata` to the URL.

#### Expected result

There should be a text saying `"message": "Everything is deleted"`.



## Testcase Results

Tested by Simeon Trumpf


| Testcase  | Working             | Comments                                              |
| --------- | ------------------- | ----------------------------------------------------- |
| T-01      | :heavy_check_mark:  | Works                                                 |
| T-02      | :heavy_check_mark:  | Works                                                 |
| T-03      | :heavy_check_mark:  | Only works if the MySQL Database is set up correctly  |
| T-04      | :heavy_check_mark:  | Works as described                                    |
| T-05      | :heavy_check_mark:  | Error happens as described                            |
| T-06      | :heavy_check_mark:  | Can create a user                                     |
| T-07      | :heavy_check_mark:  | Works as expected                                     |
| T-08      | :heavy_check_mark:  | Works but only in WSL                                 |
| T-09      | :heavy_check_mark:  | Works but only in WSL                                 |
| T-10      | :heavy_check_mark:  | All the information gets displayed                    |
| T-11      | :heavy_check_mark:  | The testdata is gone!                                 |
