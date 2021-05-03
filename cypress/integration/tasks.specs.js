const serverTaskEndPointUrl = Cypress.env('serverUrl') + "/tasks";

// debug
console.log(serverTaskEndPointUrl);
console.log('********************************');

describe('Task app', () => {

    it('should GET and display empty task list', () => {
        // config network stubs
        const fixtureZeroTask = { fixture: 'tasks/empty-task-list.json' };

        cy.intercept('GET', `${serverTaskEndPointUrl}`, fixtureZeroTask).as('getAllTasks');

        // navigate to root
        cy.visit('/');

        // wait for GET
        cy.wait('@getAllTasks');

        // THE ASSERTIONS
        cy.get('[data-testid="main-title"]').contains('Tasks History');
        cy.get('[data-testid="day"]').should('not.exist');
        cy.get('[data-testid="task-day"]').should('not.exist');
    });

    it('should GET and display a list of only one task', () => {
        // config network stubs
        console.log("it('should GET and display a list of only one task')...");

        const fixtureOneTaskRawPath = 'tasks/one-task-list-raw.json';
        const fixtureOneTaskFormattedPath = 'tasks/one-task-list-formatted.json';

        cy.intercept('GET', `${serverTaskEndPointUrl}`, { fixture: fixtureOneTaskRawPath }).as('getAllTasks');

        // navigate to root
        cy.visit('/');

        // wait for GET
        cy.wait('@getAllTasks'); // we send the tasks with the date fields in "raw" format
        // (that is ISO dates, eg "2021-03-16T10:10:00.000Z")

        // useless ??? already covered by test 1
        // cy.get('[data-testid="main-title"]').contains('Tasks History');

        cy.fixture(fixtureOneTaskFormattedPath).then((data) => {
            // second fixture has dates converted into "readable" text representations
            console.log("json fixture: " + JSON.stringify(data));
            const tasks = data.tasks;

            // THE ASSERTIONS

            //******* DAY
            // one task spans only one day
            cy.get('[data-testid="day"]').its('length').should('eq', 1);
            cy.get('[data-testid="day"]').eq(0).contains(tasks[0].day);

            //******* TASKS
            cy.get('[data-testid="task-hours"]').its('length').should('eq', tasks.length);
            cy.get('[data-testid="task-hours"]').eq(0).contains(tasks[0].hourBegin).contains(tasks[0].hourBegin);
        });
    });

    it('should GET and display a list of 5 tasks', () => {
        console.log("it('should GET and display a list of 5 tasks')...");


        // config network stubs
        // content:
        // * 5 tasks
        // * spanning 2 different days

        // config network stubs
        const fixtureFiveTaskRawPath = 'tasks/five-task-list-raw.json';
        const fixtureFiveTaskFormattedPath = 'tasks/five-task-list-formatted.json';

        cy.intercept('GET', `${serverTaskEndPointUrl}`, { fixture: fixtureFiveTaskRawPath }).as('getAllTasks');

        // navigate to root
        cy.visit('/');

        // wait for GET
        cy.wait('@getAllTasks');
  
        cy.fixture(fixtureFiveTaskFormattedPath).then((data) => {
            console.log("json fixture: " + JSON.stringify(data));
            const tasks = data.tasks;

            // THE ASSERTIONS

            //******* DAY
            // there are only 2 different days
            cy.get('[data-testid="day"]').its('length').should('eq', 2); // TODO: ok to hard code the number of days ?
            cy.get('[data-testid="day"]').eq(0).contains(tasks[0].day);

            //******* TASKS
            cy.get('[data-testid="task-hours"]').its('length').should('eq', tasks.length);

            // get newest task hours (since the UI lists tasks from newest to oldest)
            const newestTaskHourBegin = tasks[0].hourBegin;
            const newestTaskHourEnd = tasks[0].hourEnd;
            console.log("newest task hours: " + newestTaskHourBegin + " / " + newestTaskHourEnd);

            cy.get('[data-testid="task-hours"]').eq(0).contains(newestTaskHourBegin).contains(newestTaskHourEnd);

            // get oldest task hours
            const indexLastTask = tasks.length - 1;
            const oldestTaskHourBegin = tasks[indexLastTask].hourBegin;
            const oldestTaskHourEnd = tasks[indexLastTask].hourEnd;
            console.log("oldest task hours: " + oldestTaskHourBegin + " / " + oldestTaskHourEnd);

            cy.get('[data-testid="task-hours"]').eq(tasks.length - 1).contains(oldestTaskHourBegin).contains(oldestTaskHourEnd);
        });
    });
});