/**
 * Unit tests for the addFieldsToTask function
 */
import { addFieldsToTask } from '../../src/SvelteAppComponentHelper.js';

describe('Task app', () => {

    it('should format one task', () => {
        const fixtureOneTaskRawPath = 'tasks/one-task-list-raw.json';
        const fixtureOneTaskFormattedPath = 'tasks/one-task-list-formatted.json';

        cy.fixture(fixtureOneTaskRawPath).then((data) => {
            console.log("json fixture raw: " + JSON.stringify(data));
            const taskRaw = data.tasks[0];

            cy.fixture(fixtureOneTaskFormattedPath).then((data2) => {
                console.log("json fixture formatted: " + JSON.stringify(data2));
                const taskFormattedFromFixture = data2.tasks[0];

                const taskFormattedResult = addFieldsToTask(taskRaw);

                // ASSERT that the day and hours fields are equal
                expect(taskFormattedResult.day).to.eq(taskFormattedFromFixture.day);
                expect(taskFormattedResult.hourBegin).to.eq(taskFormattedFromFixture.hourBegin);
                expect(taskFormattedResult.hourEnd).to.eq(taskFormattedFromFixture.hourEnd);
            });
        });
    });
    
});