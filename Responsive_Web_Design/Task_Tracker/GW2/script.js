const dailyTasks = document.getElementById('daily-tasks');
const weeklyTasks = document.getElementById('weekly-tasks');
const newDailyEventInput = document.getElementById('new-daily-events');
const newDailyFlaxInput = document.getElementById('new-daily-flax');
const newDailyFractalsInput = document.getElementById('new-daily-fractals');
const newDailyNodesInput = document.getElementById('new-daily-nodes');
const newDailyStrikesInput = document.getElementById('new-daily-strikes');
const newWeeklyAlsoRandomStuffInput = document.getElementById('new-weekly-black-lion-chest');
const newWeeklyRaidsInput = document.getElementById('new-weekly-raids');
const newWeeklyWizardsVaultInput = document.getElementById('new-weekly-wizards-vault');
const newSingleGoalInput = document.getElementById('new-single-goal');

// Load night mode state from local storage
const nightModeState = localStorage.getItem('nightModeState');
if (nightModeState === 'true') {
    document.body.classList.add('night-mode');
}

// Load tasks and checked states from storage (you can use localStorage or a server for this)
let savedTasks = JSON.parse(localStorage.getItem('tasks'));

// Initialize default tasks if not present
savedTasks = savedTasks || {
    daily: {
        events: ["Zombi Doragon", "Naked Man", "Piñata", "Chak Gerent", "Octovine", "Dragonstorm", "Leviathan"],
        flax: ["Revenant", "Guardian", "Warrior", "Ranger", "Engineer", "Mesmer", "Necromancer", "Elementalist"],
        fractals: ["Deeply D. Keys", "Tier 4", "Recs", "CMs"],
        nodes: ["Guild", "Home", "Charged Quartz", "Wizard's Daily", "Prov. Tokens", "Ecto. Refinement", "Converters", "Drizzlewood M. D."],
        strikes: ["SotO", "IBS", "EoD"]
    },
    weekly: {
        'also-random-stuff': ["Key", "Wizard's Vault"],
        raids: ["Spirit Vale", "Salvation Pass", "Stronghold of the Faithful", "Bastion of the Penitent", "Hall of Chains", "Mythwright Gambit", "The Key of Ahdashim"],
        'strikes-jpg': ["SotO", "EoD", "EoD CM"]
    },
    singleGoals: [],
    dailyChecked: {
        events: [false, false, false, false, false, false, false],
        flax: [false, false, false, false, false, false, false, false],
        fractals: [false, false, false, false],
        nodes: [false, false, false, false, false, false, false, false],
        strikes: [false, false, false],
    },
    weeklyChecked: {
        'also-random-stuff': [false, false],
        raids: [false, false, false, false, false, false, false],
        'strikes-jpg': [false, false, false]
    }
};

function updateTaskList() {
    updateTaskGroup('daily', 'events', newDailyEventInput, 'daily-tasks-events');
    updateTaskGroup('daily', 'flax', newDailyFlaxInput, 'daily-tasks-flax');
    updateTaskGroup('daily', 'fractals', newDailyFractalsInput, 'daily-tasks-fractals');
    updateTaskGroup('daily', 'nodes', newDailyNodesInput, 'daily-tasks-nodes');
    updateTaskGroup('daily', 'strikes', newDailyStrikesInput, 'daily-tasks-strikes');

    updateTaskGroup('weekly', 'also-random-stuff', newWeeklyAlsoRandomStuffInput, 'weekly-tasks-also-random-stuff');
    updateTaskGroup('weekly', 'raids', newWeeklyRaidsInput, 'weekly-tasks-raids');
    updateTaskGroup('weekly', 'strikes-jpg', newWeeklyWizardsVaultInput, 'weekly-tasks-strikes-jpg');

    updateSingleGoals();
}

function updateTaskGroup(category, subgroup, inputElement, taskListId) {
    const taskList = document.getElementById(taskListId);
    const newTaskInput = inputElement;

    taskList.innerHTML = savedTasks[category][subgroup].map((task, index) => {
                      const checked = savedTasks[category + 'Checked'][subgroup][index] ? 'checked' : '';
        return `
            <li>
                <input type="checkbox" id="${category}-${subgroup}-${index}" ${checked} onchange="toggleTask('${category}', '${subgroup}', ${index})">
                <label for="${category}-${subgroup}-${index}">${task}</label>
                <span class="delete-button" onclick="deleteTask('${category}', '${subgroup}', ${index})">✘</span>
            </li>`;
    }).join('');
}

function updateSingleGoals() {
    const singleGoalsList = document.getElementById('single-goals');
    singleGoalsList.innerHTML = savedTasks.singleGoals.map((goal, index) => `
        <li>
            <input type="checkbox" id="single-goal-${index}" onchange="toggleSingleGoal(${index})">
            <label for="single-goal-${index}">${goal}</label>
            <span class="delete-button" onclick="deleteSingleGoal(${index})">✘</span>
        </li>`
    ).join('');
}

function addDailyTask(subgroup) {
    const newTaskInput = getInputElement(subgroup);
    const newTask = newTaskInput.value.trim();

    if (newTask !== '') {
        savedTasks.daily[subgroup].push(newTask);
        savedTasks.dailyChecked[subgroup].push(false);
        updateTaskList();
        saveTasksToStorage();
        newTaskInput.value = '';
    }

    return false; // Prevent the form from submitting
}

function addWeeklyTask(subgroup) {
    const newTaskInput = getInputElement(subgroup);
    const newTask = newTaskInput.value.trim();
    
    if (newTask !== '') {
        // Check if the subgroup exists in the savedTasks.weekly object
        if (!savedTasks.weekly.hasOwnProperty(subgroup)) {
            savedTasks.weekly[subgroup] = [];
            savedTasks.weeklyChecked[subgroup] = [];
        } 
        savedTasks.weekly[subgroup].push(newTask);
        savedTasks.weeklyChecked[subgroup].push(false);
        updateTaskList();
        saveTasksToStorage();
        newTaskInput.value = '';
        }

    return false; // Prevent the form from submitting
}

function addSingleGoal() {
    const newGoalInput = newSingleGoalInput;
    const newGoal = newGoalInput.value.trim();

    if (newGoal !== '') {
        savedTasks.singleGoals.push(newGoal);
        updateTaskList();
        saveTasksToStorage();
        newGoalInput.value = '';
    }

    return false; // Prevent the form from submitting
}

function deleteTask(category, subgroup, index) {
    savedTasks[category][subgroup].splice(index, 1);
    savedTasks[category + 'Checked'][subgroup].splice(index, 1);
    updateTaskList();
    saveTasksToStorage();
}

function deleteSingleGoal(index) {
    savedTasks.singleGoals.splice(index, 1);
    updateTaskList();
    saveTasksToStorage();
}

function toggleTask(category, subgroup, index) {
    savedTasks[category + 'Checked'][subgroup][index] = !savedTasks[category + 'Checked'][subgroup][index];
    saveTasksToStorage();
}

function toggleSingleGoal(index) {
    savedTasks.singleGoalsChecked[index] = !savedTasks.singleGoalsChecked[index];
    saveTasksToStorage();
}

function resetDailyTasks() {
    // Reset only the checked states for daily tasks
    savedTasks.dailyChecked = {
    events: Array(savedTasks.daily.events.length).fill(false),
    flax: Array(savedTasks.daily.flax.length).fill(false),
    fractals: Array(savedTasks.daily.fractals.length).fill(false),
    nodes: Array(savedTasks.daily.nodes.length).fill(false),
    strikes: Array(savedTasks.daily.strikes.length).fill(false),
    };
    updateTaskList();
    saveTasksToStorage();
}

function resetWeeklyTasks() {
    // Reset only the checked states for weekly tasks
    savedTasks.weeklyChecked = {
    'also-random-stuff': Array(savedTasks.weekly['also-random-stuff'].length).fill(false),
    raids: Array(savedTasks.weekly.raids.length).fill(false),
    'strikes-jpg': Array(savedTasks.weekly['strikes-jpg'].length).fill(false),
    };
    updateTaskList();
    saveTasksToStorage();
}


function toggleNightMode() {
    document.body.classList.toggle('night-mode');
    const nightModeState = document.body.classList.contains('night-mode');
    localStorage.setItem('nightModeState', nightModeState);
    
    const nightModeIcon = document.getElementById('night-mode-icon');
    nightModeIcon.innerText = nightModeState ? '🌙' : '☀️';
    
}
// Initial update when the page loads
updateNightModeIcon();

function updateNightModeIcon() {
    const nightModeState = localStorage.getItem('nightModeState') === 'true';
    const nightModeIcon = document.getElementById('night-mode-icon');
    nightModeIcon.innerText = nightModeState ? '🌙' : '☀️';

    if (nightModeState) {
        document.body.classList.add('night-mode');
    }
}

// Call the function to update the night mode icon when the page loads
window.addEventListener('load', updateNightModeIcon);

function saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
}

function getInputElement(subgroup) {
    switch (subgroup) {
        case 'events': return newDailyEventInput;
        case 'flax': return newDailyFlaxInput;
        case 'fractals': return newDailyFractalsInput;
        case 'nodes': return newDailyNodesInput;
        case 'strikes': return newDailyStrikesInput;
        case 'also-random-stuff': return newWeeklyAlsoRandomStuffInput;
        case 'raids': return newWeeklyRaidsInput;
        case 'strikes-jpg': return newWeeklyWizardsVaultInput;
        default: return null;
    }
}

// Initial update when the page loads
updateTaskList();
