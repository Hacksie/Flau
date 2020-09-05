import { Action, Reducer } from 'redux';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface Stages {
    stages: Stage[]
}

export interface Stage {
    id: number, desc: string, icon: string
}
// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<Stages> = (state: Stages | undefined, incomingAction: Action): Stages => {
    if (state === undefined) {
        return { stages: [ {id:0, desc: "New", icon: "circle"}, {id:1, desc:"In Progress", icon: "time"}, {id:2, desc:"Complete", icon: "check"}] };
    }

    return state;

    //const action = incomingAction as KnownAction;
    // switch (action.type) {
    //     default:
    //         return state;
    // }
};
