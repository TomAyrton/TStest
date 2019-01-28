type node = {
    id: number,
    name: string,
    children: Array<Node> | any[]
}
const tree = document.getElementById('tree');
let counter: number = 0;
let InitialTree: Array<node>;
if (!localStorage.getItem('myTree')) {
	InitialTree = [
		{
			id: createId(),
			name: '0 Node',
			children: [
				{
					id: createId(),
					name: '1 Node',
					children: []
  },
				{
					id: createId(),
					name: '2 Node',
					children: [
						{
							id: createId(),
							name: '3 Node',
							children: []
					},
						{
							id: createId(),
							name: '4 Node',
							children: []
					}
  ]
  }]
	}];
} else {
	InitialTree = JSON.parse(localStorage.getItem('myTree'));
}




build();

tree.onclick = (e) => {
	let target = e.target;
	options(target);
}




function build(): void {
	InitialTree.forEach((item) => { createTree(item, tree) });
}

function rebuild(): void {
	while (tree.firstChild) {
		tree.removeChild(tree.firstChild);
	}
	build();

	let treeJSON = JSON.stringify(InitialTree);
	localStorage.setItem('myTree', treeJSON);
}

function createTree(obj, place) {
	if (isObjectEmpty(obj)) {
		return;
	}

	let ul = document.createElement('ul');
	let li = document.createElement('li');
	li.setAttribute('id', obj.id);
	li.innerHTML = obj.name;
	ul.appendChild(li);

	if (obj.children.length) {
		obj.children.forEach((item) => { createTree(item, li) })
	}

	place.appendChild(ul);
}

function isObjectEmpty(obj: object): boolean {
	for (let key in obj) {
		return false;
	}
	return true;
}

function createId(): number {
	return counter++;
}

function options(elem): void {
	let idNumber: number = +elem.getAttribute('id');
	let option: string = prompt('Удалить: 0 \n Переименовать: 1 \n Добавить узлы: 2', '');
	switch (option) {
		case '0':
			InitialTree = deleteObj(idNumber, InitialTree);
			rebuild();
			break;
		case '1':
			let newName: string = prompt('Введите новое имя', 'name');
			renameObj(idNumber, InitialTree, newName);
			rebuild();
			break;
		case '2':
			let names: string = prompt('Введите имена для новых объектов через запятую', 'name1, name2, name3');
			addObj(idNumber, InitialTree, names);
			rebuild();
            break;
        default:
            options(elem);
            break;
	}
}

function deleteObj(idToDelete: number, arr): any[] {
	arr = arr.filter((item) => {
		if (item.id == idToDelete) {
			return false;
		}
        return true;
	});
	arr.forEach((item) => {
		if (item.children.length) {
			item.children = deleteObj(idToDelete, item.children);
		}
	});
	return arr;
}

function renameObj(idToRename: number, arr, newName: string): void {
	arr.forEach((item) => {
		if (item.id == idToRename) {
			item.name = newName;
		} else {
			renameObj(idToRename, item.children, newName);
		}
	})
}

function addObj(idToAdd: number, arr, newNames: string): void {
	arr.forEach((item) => {
		if (item.id == idToAdd) {
			let obj = item;
			let objs: string[] = newNames.split(', ');
			objs.forEach((item) => {
				obj.children.push({
					name: item,
					id: createId(),
					children: []
				});
			});
		} else {
			addObj(idToAdd, item.children, newNames);
		}
	});
}