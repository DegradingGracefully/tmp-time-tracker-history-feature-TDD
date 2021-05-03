//TODO: move this function inside App.svelte, since it belongs only to this view
// however, we need a "preprocessor" for cypress to understand the svelte syntax ?
import { format as dateFormat } from 'date-fns'

/**
 * addFieldsToTask "transforms" the original task object ISO date fields
 * into readable text representations
 * Returns the original task augmented with these fields
 */
export function addFieldsToTask(task) {
	const dayFormat = "EEEE, MMMM dd"; // produces "Tuesday, March 16"
	const hourFormat = "HH:mm"; // produces "11:10"

	// the 2 lines below are just a hack to remove the timezone part from the Date string representation
	// eg for the string "2021-03-16T10:10:00.000Z" we remove the .000Z timezone part
	// so that the new Date(dateString) constructor uses the local timezone
	// if we were to leave the timezone, the new Date(dateString) would convert the time
	// from timezone .000Z (which is UTC+0 hour) to the local timezone of the computer
	// basically it enables us to ignore timezones entirely (we don't need any timezone notion here)
	const taskDateBeginStripTimeZone = task.dateBegin.substring(0, task.dateBegin.indexOf("."));
	const taskDateEndStripTimeZone =  task.dateEnd.substring(0, task.dateBegin.indexOf("."));
	console.log(dateFormat(new Date(taskDateBeginStripTimeZone), dayFormat));
	// default locale for date-fns formatting is en-US 
	console.log(dateFormat(new Date(taskDateBeginStripTimeZone), hourFormat));

	// we assume the following rule: one given task spans only one day
	// so for the day it doesn't matter if we take the dateBegin or dateEnd field
	const taskDay = dateFormat(new Date(taskDateBeginStripTimeZone), dayFormat);
	const taskHourBegin = dateFormat(new Date(taskDateBeginStripTimeZone), hourFormat);
	const taskHourEnd = dateFormat(new Date(taskDateEndStripTimeZone), hourFormat);

	const taskWithAddedFields = { ...task, "day": taskDay, "hourBegin": taskHourBegin, "hourEnd": taskHourEnd };
	console.log("Task after adding the fields: " + JSON.stringify(taskWithAddedFields));
	return taskWithAddedFields;
}