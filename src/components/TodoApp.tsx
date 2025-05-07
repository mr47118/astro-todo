import { createSignal, onMount, For } from "solid-js";

export default function TodoApp() {
	const [todos, setTodos] = createSignal<
		Array<{
			created_at: string | number | Date;
			id: number;
			title: string;
			completed: boolean;
		}>
	>([]);
	const [newTitle, setNewTitle] = createSignal("");

	onMount(async () => {
		const res = await fetch("/api/todos");
		setTodos(await res.json());
	});

	const addTodo = async () => {
		const title = newTitle().trim();
		if (!title) return;
		const res = await fetch("/api/todos", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title }),
		});
		const todo = await res.json();
		setTodos([todo, ...todos()]);
		setNewTitle("");
	};

	const toggleTodo = async (id: number, completed: boolean) => {
		const res = await fetch("/api/todos", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id, completed }),
		});
		const updated = await res.json();
		setTodos(todos().map((todo) => (todo.id === id ? updated : todo)));
	};

	const deleteTodo = async (id: number) => {
		await fetch("/api/todos", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});
		setTodos(todos().filter((t) => t.id !== id));
	};

	return (
		<div class="mx-auto max-w-xl p-10 text-base font-normal">
			<div class="text-content shadow-dark-blue-900 relative mb-4 h-16 w-full rounded-md shadow-md focus-within:shadow-xl">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						addTodo();
					}}
					class="size-full"
				>
					<input
						type="text"
						value={newTitle()}
						onInput={(e) => setNewTitle(e.currentTarget.value)}
						placeholder="Create a new todo..."
						class="h-full w-full rounded-md border-transparent bg-transparent px-13 text-base outline-1 focus:text-blue-200 focus:outline-blue-400"
					/>
				</form>
			</div>
			<ul class="w-full divide-y drop-shadow-xl">
				<For each={todos()} fallback={<li class="py-2">No todos yet.</li>}>
					{(todo) => (
						<li class="group relative flex h-16 items-center gap-3 select-none">
							<button
								class="pr-2 pl-4 opacity-50 transition-all duration-100 hover:cursor-pointer hover:opacity-100"
								type="button"
								on:click={() => toggleTodo(todo.id, !todo.completed)}
							>
								{todo.completed ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-square-check-big-icon lucide-square-check-big"
									>
										<path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5" />
										<path d="m9 11 3 3L22 4" />
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-square-icon lucide-square"
									>
										<rect width="18" height="18" x="3" y="3" rx="2" />
									</svg>
								)}
							</button>

							<div
								class="flex h-full flex-grow items-center"
								classList={{ "line-through opacity-50": todo.completed }}
							>
								{todo.title}
							</div>

							<button
								class="invisible aspect-square h-full opacity-25 transition-opacity duration-100 group-hover:visible hover:cursor-pointer hover:opacity-100"
								on:click={() => deleteTodo(todo.id)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="mx-auto size-5"
								>
									<path d="M18 6 6 18" />
									<path d="m6 6 12 12" />
								</svg>
							</button>
						</li>
					)}
				</For>
			</ul>
		</div>
	);
}
