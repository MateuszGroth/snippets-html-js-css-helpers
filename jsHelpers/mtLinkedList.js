class EvtNode {
    constructor(value){
        this.value = value;
        this.next = null;
    }

    setNext(node){
        this.next = node;
    }

    getNext(){
        return this.next
    }

}

class LinkedList {
    constructor(){
        this.setRoot(null);
        this.currentNode = this.getRoot();
        this.cnt = 0;
    }

    push(value){
        const newNode = new EvtNode(value);

        if (!this.currentNode) {
            this.setRoot(newNode);
            this.currentNode = newNode;
            this.cnt++;

            return true;
        }

        this.currentNode.setNext(newNode)
        this.currentNode = newNode;
        this.cnt++;

        return true;
    }

    setRoot(node) {

        this.root = node;
    }

    getRoot(){

        return this.root
    }

    getNode(id) {
        if (LinkedList.validateId(id) || id >= this.cnt) return null;

        if (id === 0) return this.getRoot();

        let i = 1;
        let tmpNode = this.getRoot().getNext();
        while (i < id){
            tmpNode = tmpNode.getNext();
            i++;
        }

        return tmpNode;
    }

    get(id){
        const node = this.getNode(id);

        return !!node ? node.value : null;
    }

    add(id, value) {

        if (LinkedList.validateId(id) || id > this.cnt) return false;

        if (id === this.cnt) {
            this.push(value);

            return true;
        } else if (id === 0) {
            const newNode = new EvtNode(value);
            newNode.setNext(this.getRoot());
            this.setRoot(newNode);
            this.cnt++;
            return true;
        }

        let tmpPrevNode = this.getRoot();
        let tmpNode = tmpPrevNode.getNext();

        let i = 1;
        while (i < id){
            tmpPrevNode = tmpNode;
            tmpNode = tmpNode.getNext();
            i++;
        }

        const newNode = new EvtNode(value);
        tmpPrevNode.setNext(newNode);
        newNode.setNext(tmpNode);
        this.cnt++;

        return true
    }

    delete(id) {

        if (LinkedList.validateId(id) || id >= this.cnt) return false;

        if (id === this.cnt - 1 ) {
            const prevNode = this.getNode(id - 1);

            !!prevNode ? prevNode.setNext(null) : null;
            this.currentNode = prevNode;
            this.cnt--;

            return true;
        } else if (id === 0) {
            this.setRoot(this.getRoot().getNext());
            this.cnt--;

            return true;
        }

        let tmpNode = this.getRoot();

        let i = 1;
        while(i < id){
            tmpNode = tmpNode.getNext();
            i++;
        }

        tmpNode.setNext(tmpNode.getNext().getNext())
        this.cnt--;

        return true;
    }


    static validateId(id) {

        return typeof id !== 'number' || Math.floor(id) !== id ||  id < 0
    }

    static getArrayFromList(linkedList){
        const arr = [];

        if (linkedList.length === 0) return arr;

        return LinkedList.getNextRecursiveArr(linkedList.getRoot())
    }

    static getNextRecursiveArr(node) {

        if (node.getNext() === null) return [node.value];

        return [node.value, ...LinkedList.getNextRecursiveArr(node.getNext())]
    }

    static reverse(linkedList) {
        if (linkedList.length <= 1 ) return;

        const root = linkedList.getRoot();

        const newRoot = LinkedList.recursiveReverse(root);

        root.setNext(null)
        linkedList.setRoot(newRoot);
        linkedList.currentNode = root;
    }

    static recursiveReverse(node) {
        const nextNode = node.getNext();

        if (!nextNode)
            return node;

        const newRoot = LinkedList.recursiveReverse(nextNode);
        nextNode.setNext(node)

        return newRoot;
    }

    get length(){

        return this.cnt;
    }
}