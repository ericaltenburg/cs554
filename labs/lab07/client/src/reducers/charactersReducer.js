const initialState = [
    {
        pageTerm: '',
        characterData: undefined,
    }
];

const charactersReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        case 'SET_PAGE':
            console.log('payload ', payload);
            return [
                ...state,
                {pageTerm: payload.pageTerm, characterData: payload.pageData}
            ];
        default:
            return state;
    }
};

export default charactersReducer;