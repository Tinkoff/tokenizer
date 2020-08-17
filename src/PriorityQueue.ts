export class PriorityQueue<T> {
    items: T[] = [];

    push(value: T, priority: number) {
        this.items[priority] = value;
    }

    shift() {
        for (const i in this.items) {
            const value = this.items[i];
            delete this.items[i];
            return  value;
        }
        return null;
    }
}