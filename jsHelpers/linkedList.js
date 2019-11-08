// linked list is a list of nodes where each node contains its data 
// and a pointer to the following node in the list
// eg. n1 = {data : 100 , next : {data : 200}} n2 =
class Node {
    constructor(data, next = null){
        this.data = data;
        this.next = next;
    }
}

class LinkedList{
    constructor(){
        this.head = null;
        this.size = 0;
    }

    // insert first node
    _insertFirst(data){
        this.head = new Node(data, this.head);
        this.size ++;
    }
    // insert last node
    _insertLast(data){
        let node = new Node(data);
        let current;

        if (this.head === null){
            this.head = node;
        } else {
            current = this.head;
            while(current.next){
                current = current.next
            }
            current.next = node;
            
        }
        this.size ++;
    }

    // insert at index
    _insertAt(data, index){
        if (index > 0 && index > this.size) return;

        if (index === 0) this._insertFirst(data);

        const node = new Node(data);

        let current, previous;
        let count = 0;
        current = this.head
        while(count < index){
            previous = current;
            count++;
            current = current.next; 
        }
        node.next = current;
        previous.next = node;

        this.size++;

    }

    // get at index

    // remove at index

    // clear list

    // print list data
    printListData(){
        let current = this.head;

        while(current){
            console.log(current.data);
            current = current.next;
        }
    }
}

const ll = new LinkedList();

ll._insertFirst(100);
ll._insertFirst(200);
ll._insertFirst(300);
ll._insertLast(400);
ll._insertAt(500, 2);
ll.printListData();
