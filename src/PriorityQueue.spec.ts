import { PriorityQueue } from "./PriorityQueue";

describe('queue', () => {

    it('basic', () => {
        const q = new PriorityQueue();
        q.push(3, 100);
        q.push(1, 3);
        q.push(2, 2);
        expect(q.shift()).toEqual(2);
        expect(q.shift()).toEqual(1);
        expect(q.shift()).toEqual(3);
    });

});