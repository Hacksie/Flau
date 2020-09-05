import { Action, Reducer } from 'redux';


// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface Flau {
    items: FlauItem[]
    selectedId: number;
}

export interface FlauItem {
    parentId: number | undefined;
    id: number;
    summary: string;
    stageId: number;
    children: FlauItem[];
}


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface SelectedAction { type: 'SELECTED', id: number }
export interface NextAction { type: 'NEXT', id: number }
export interface PrevAction { type: 'PREV', id: number }
export interface SplitAction { type: 'SPLIT', id: number, start: number, end: number }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = SelectedAction | NextAction | PrevAction | SplitAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    next: (itemId: number) => ({ type: 'NEXT', id: itemId } as NextAction),
    prev: (itemId: number) => ({ type: 'PREV', id: itemId } as PrevAction),
    select: (itemId: number) => ({ type: 'SELECTED', id: itemId } as SelectedAction),
    split: (itemId: number, start: number, end: number) => ({ type: 'SPLIT', id: itemId, start: start, end: end } as SplitAction),
};



// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<Flau> = (state: Flau | undefined, incomingAction: Action): Flau => {
    if (state === undefined) {
        return { items: [{ parentId: undefined, id: 0, summary: "Test", stageId: 0, children: [] }, { parentId: undefined, id: 1, summary: "Test1", stageId: 2, children: [] }], selectedId: 0 };
    }

    var newFlau = { ...state };

    const action = incomingAction as KnownAction;

    switch (action.type) {
        case 'SPLIT':
            newFlau.items = state.items.slice();
            var selectedItem = newFlau.items.find(i => i.id == newFlau.selectedId);
            var newId = Math.max.apply(Math, newFlau.items.map(function(o) { return o.id })) + 1;

            if (selectedItem) {
                var summary = selectedItem.summary;
                
                var left = summary.slice(0, action.start);
                var right = summary.slice(action.end, summary.length);

                var newItem: FlauItem = {
                    parentId : selectedItem.parentId,
                    id :newId,
                    stageId :selectedItem.stageId,   
                    summary:right,
                    children: selectedItem.children
                }
                selectedItem.children = [];
                selectedItem.summary = left;
                newFlau.items.splice(newFlau.selectedId + 1, 0,newItem);
                newFlau.selectedId = newId;
            }

            return newFlau;
        case 'SELECTED':
            newFlau.selectedId = action.id;
            return newFlau;
        case 'NEXT':
            newFlau.items = state.items.slice();

            if (newFlau.items) {
                var item = newFlau.items.find(i => i.id === action.id);

                if (item) {
                    var stageId = item.stageId;
                    item.stageId = stageId < 2 ? stageId + 1 : 0;

                    return newFlau;
                }
            }
            break;
        case 'PREV':

            newFlau.items = state.items.slice();
            var item = newFlau.items.find(i => i.id === action.id);

            if (item) {
                var stageId = item.stageId;
                item.stageId = stageId > 0 ? stageId - 1 : stageId;

                return newFlau;
            }
            break;
        default:
            return state;
    }


    return state;
};
