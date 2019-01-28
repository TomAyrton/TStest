var tree = document.getElementById('tree');
var counter = 0;
var InitialTree;
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
                }
            ]
        }
    ];
}
else {
    InitialTree = JSON.parse(localStorage.getItem('myTree'));
}
build();
tree.onclick = function (e) {
    var target = e.target;
    options(target);
};
function build() {
    InitialTree.forEach(function (item) { createTree(item, tree); });
}
function rebuild() {
    while (tree.firstChild) {
        tree.removeChild(tree.firstChild);
    }
    build();
    var treeJSON = JSON.stringify(InitialTree);
    localStorage.setItem('myTree', treeJSON);
}
function createTree(obj, place) {
    if (isObjectEmpty(obj)) {
        return;
    }
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    li.setAttribute('id', obj.id);
    li.innerHTML = obj.name;
    ul.appendChild(li);
    if (obj.children.length) {
        obj.children.forEach(function (item) { createTree(item, li); });
    }
    place.appendChild(ul);
}
function isObjectEmpty(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}
function createId() {
    return counter++;
}
function options(elem) {
    var idNumber = +elem.getAttribute('id');
    var option = prompt('Удалить: 0 \n Переименовать: 1 \n Добавить узлы: 2', '');
    switch (option) {
        case '0':
            InitialTree = deleteObj(idNumber, InitialTree);
            rebuild();
            break;
        case '1':
            var newName = prompt('Введите новое имя', 'name');
            renameObj(idNumber, InitialTree, newName);
            rebuild();
            break;
        case '2':
            var names = prompt('Введите имена для новых объектов через запятую', 'name1, name2, name3');
            addObj(idNumber, InitialTree, names);
            rebuild();
            break;
        default:
            options(elem);
            break;
    }
}
function deleteObj(idToDelete, arr) {
    arr = arr.filter(function (item) {
        if (item.id == idToDelete) {
            return false;
        }
        return true;
    });
    arr.forEach(function (item) {
        if (item.children.length) {
            item.children = deleteObj(idToDelete, item.children);
        }
    });
    return arr;
}
function renameObj(idToRename, arr, newName) {
    arr.forEach(function (item) {
        if (item.id == idToRename) {
            item.name = newName;
        }
        else {
            renameObj(idToRename, item.children, newName);
        }
    });
}
function addObj(idToAdd, arr, newNames) {
    arr.forEach(function (item) {
        if (item.id == idToAdd) {
            var obj_1 = item;
            var objs = newNames.split(', ');
            objs.forEach(function (item) {
                obj_1.children.push({
                    name: item,
                    id: createId(),
                    children: []
                });
            });
        }
        else {
            addObj(idToAdd, item.children, newNames);
        }
    });
}
