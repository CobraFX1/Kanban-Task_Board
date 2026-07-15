import "./style.css";

function createModal(): HTMLElement {
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 p-4 opacity-0 pointer-events-none transition-opacity";
  overlay.style.transition = "opacity 200ms ease";

  const panel = document.createElement("div");
  panel.className =
    "w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-slate-200";

  const title = document.createElement("h2");
  title.className = "mb-4 text-xl font-semibold text-slate-900";
  title.textContent = "Create New Task";

  const titleLabel = document.createElement("label");
  titleLabel.className = "mb-2 block text-sm font-medium text-slate-700";
  titleLabel.textContent = "Title";

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.className =
    "mb-4 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100";
  titleInput.placeholder = "Write task title";

  const priorityLabel = document.createElement("label");
  priorityLabel.className = "mb-2 block text-sm font-medium text-slate-700";
  priorityLabel.textContent = "Priority";

  const prioritySelect = document.createElement("select");
  prioritySelect.className =
    "mb-6 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

  ["low", "medium", "high"].forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value.charAt(0).toUpperCase() + value.slice(1);
    prioritySelect.appendChild(option);
  });

  const actions = document.createElement("div");
  actions.className = "flex justify-end gap-3";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className =
    "rounded-full bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200 transition";
  cancelButton.textContent = "Cancel";

  const doneButton = document.createElement("button");
  doneButton.type = "button";
  doneButton.className =
    "rounded-full bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 transition";
  doneButton.textContent = "Done";
  
  // FIX 1: Use .value to capture the typed text and selected dropdown choice!
  doneButton.addEventListener("click", () => {
    updateData(titleInput.value, prioritySelect.value);
    titleInput.value = ""; // Clear the input field for next use
    closeModal(overlay);
  });

  actions.append(cancelButton, doneButton);
  panel.append(
    title,
    titleLabel,
    titleInput,
    priorityLabel,
    prioritySelect,
    actions,
  );
  overlay.appendChild(panel);

  cancelButton.addEventListener("click", () => closeModal(overlay));
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeModal(overlay);
    }
  });

  document.body.appendChild(overlay);
  return overlay;
}

function openModal(overlay: HTMLElement) {
  overlay.classList.remove("opacity-0", "pointer-events-none");
  overlay.classList.add("opacity-100");
}

function closeModal(overlay: HTMLElement) {
  overlay.classList.add("opacity-0", "pointer-events-none");
  overlay.classList.remove("opacity-100");
}

const modal = createModal();
closeModal(modal);

const button = document.querySelector<HTMLButtonElement>("button");
button?.addEventListener("click", () => openModal(modal));

export type TaskStatus = "todo" | "doing" | "done";
export interface Task<T = string> {
  id: string;
  title: string;
  state: TaskStatus;
  metaData: T;
}
export interface TaskMetadata {
  priority: "low" | "high" | "medium";
  tags?: string[];
}
export type KanbanTask = Task<TaskMetadata>;

function getNextStatus(CurrentStatus: TaskStatus): TaskStatus {
  switch (CurrentStatus) {
    case "todo":
      return "doing";
    case "doing":
      return "done";
    case "done":
      return "done";
  }
}

function updateData(title: string, priority: string) {
  // 1. Grab the starting column container
  const container = document.querySelector(".to-do");
  if (!container) return;

  // 2. Create the card wrapper
  const card = document.createElement("div");
  card.className = "p-4 mb-3 rounded-2xl shadow-sm border border-slate-100 cursor-pointer transition transform active:scale-95";

  // 3. Set the background color based on priority selection
  if (priority === "low") {
    card.classList.add("bg-blue-50", "border-blue-200", "text-blue-900");
  } else if (priority === "medium") {
    card.classList.add("bg-yellow-50", "border-yellow-200", "text-yellow-900");
  } else if (priority === "high") {
    card.classList.add("bg-red-50", "border-red-200", "text-red-900");
  }

  // 4. Create internal elements (h1 for title, p for priority)
  const cardTitle = document.createElement("h1");
  cardTitle.className = "font-semibold text-base mb-1";
  cardTitle.textContent = title;

  const cardPriority = document.createElement("p");
  cardPriority.className = "text-xs font-bold uppercase tracking-wider opacity-80";
  cardPriority.textContent = `Priority: ${priority}`;

  // 5. Assemble card structure
  card.append(cardTitle, cardPriority);

  // Keep track of this specific card's status
  let currentStatus: TaskStatus = "todo";

  // 6. Interactive Click Transition Machine
  card.addEventListener("click", () => {
    currentStatus = getNextStatus(currentStatus);

    // FIX 2: Translate status "todo" to class ".to-do" to match your HTML
    const classSelector = currentStatus === "todo" ? "to-do" : currentStatus;
    const targetColumn = document.querySelector(`.${classSelector}`);
    
    if (targetColumn) {
      targetColumn.appendChild(card);
    }
  });

  // 7. Render on board
  container.appendChild(card);
}