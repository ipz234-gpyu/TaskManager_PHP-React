import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    team: null,
    members: [],
    invitations: []
};

const menageTeamSlice = createSlice({
    name: 'menageTeamSlice',
    initialState,
    reducers: {
        setTeam: (state, action) => {
            state.team = action.payload;
        },
        setMembers: (state, action) => {
            state.members = action.payload;
        },
        setInvitation: (state, action) => {
            state.invitations = action.payload;
        },
        invite: (state, action) => {
            state.invitations.push(action.payload);
        },
        kickMember: (state, action) => {
            state.members = state.members.filter(member => member.id !== action.payload);
        },
        removeInvitation: (state, action) => {
            state.invitations = state.invitations.filter(invitation => invitation.id !== action.payload);
        }
    }
});

export const {
    setTeam,
    setMembers,
    setInvitation,
    invite,
    kickMember,
    removeInvitation
} = menageTeamSlice.actions;

export default menageTeamSlice.reducer;