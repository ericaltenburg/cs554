const initialState = [
    {
        pageTerm: '',
        comicData: undefined,
    }
];

const comicListReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        case 'SET_PAGE':
            console.log('payload ', payload);
            return [
                ...state,
                {pageTerm: payload.pageTerm, comicData: payload.pageData}
            ];
        default:
            return state;
    }
};

export default comicListReducer;