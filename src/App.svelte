<script>
	import { onMount } from "svelte";

	import { addFieldsToTask } from "./SvelteAppComponentHelper.js";

	let tasks;
	let daysArray = [];

	onMount(async () => {
		// 1) fetches the json containing the list of tasks to display
		let result = await fetch("http://localhost:5009/tasks");
		result = await result.json();
		console.log("GET json data: " + JSON.stringify(result));
		const tasksBeforeCalculations = result.tasks;

		// 2) augments the original tasks with additional "readable" date fields, for display
		tasks = tasksBeforeCalculations.reduce((arrayResult, task) => {
			arrayResult.push(addFieldsToTask(task));
			return arrayResult;
		}, []);
		console.log("tasks with added fields = " + JSON.stringify(tasks));

		// 3) we need a daysArray array that indexes the different days present
		// in the tasks
		daysArray = tasks.reduce((arrayResult, task) => {
			/* console.log(arrayResult + " => " + task.day + " => " + arrayResult.indexOf(task.day)); */
			if (arrayResult.indexOf(task.day) === -1) {
				arrayResult.push(task.day);
			}
			return arrayResult;
		}, []);
		console.log("daysArray => " + JSON.stringify(daysArray));
	});

	function filterTaskForDay(task, day) {
		// console.log("filterTaskForDay task = " + task.day + " day = " + day);
		return task.day === day;
	}
</script>

<div data-testid="main-title"><h2>Tasks History</h2></div>

<div><strong>Day / Hours</strong></div>
<br />

{#each daysArray as day}
	<div data-testid="day"><u>{day}</u></div>
	<br />

	{#each tasks.filter((iterateTask) =>
		filterTaskForDay(iterateTask, day)
	) as task}
		<div data-testid="task-hours">
			<i>{task.hourBegin} - {task.hourEnd}</i>
			<br />
			{task.title}
		</div>
		<br />
	{/each}
{/each}