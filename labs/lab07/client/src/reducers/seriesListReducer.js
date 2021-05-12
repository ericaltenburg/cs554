const initialState = [
    {
        pageTerm: '',
        seriesData: undefined,
    }
];

const seriesListReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        case 'SET_PAGE':
            console.log('payload ', payload);
            return [
                ...state,
                {pageTerm: payload.pageTerm, seriesData: payload.pageData}
            ];
        default:
            return state;
    }
};

export default seriesListReducer;