import { createApi } from '@reduxjs/toolkit/query/react';
import {
    setTeam,
    setMembers,
    setInvitation,
    invite,
    kickMember,
    removeInvitation
} from './menageTeamSlice.js';
import { baseQueryWithReauth } from './../baseApi';
import { addTeam } from "../dashboards/dashboardsSlice.js";

export const menageTeamApi = createApi({
    reducerPath: 'menageTeamApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Team', 'Members', 'Invitations'],
    endpoints: (builder) => ({
        getTeam: builder.mutation({
            query: (teamId) => ({
                url: '/menageTeam/getTeam',
                method: 'POST',
                body: JSON.stringify({teamId})
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(setTeam(data.data.team));
                    dispatch(setMembers(data.data.members));
                    dispatch(setInvitation(data.data.invitations));
                } catch (error) {
                    console.error('Error loading team data:', error);
                }
            },
            providesTags: ['Team', 'Members', 'Invitations']
        }),
        inviteUser: builder.mutation({
            query: (credentials) => ({
                url: '/menageTeam/inviteUser',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(invite(data.data.invitation));
                } catch (error) {
                    console.error('Error sending invitation:', error);
                }
            },
            invalidatesTags: ['Invitations']
        }),
        revokeInvitation: builder.mutation({
            query: (credentials) => ({
                url: '/menageTeam/revokeInvitation',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(removeInvitation(data.data.invitationId));
                } catch (error) {
                    console.error('Error revoking invitation:', error);
                }
            },
            invalidatesTags: ['Invitations']
        }),
        kickMember: builder.mutation({
            query: (credentials) => ({
                url: '/menageTeam/kickMember',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(kickMember(data.data.memberId));
                } catch (error) {
                    console.error('Error kicking member:', error);
                }
            },
            invalidatesTags: ['Members']
        }),
        acceptInvitation: builder.mutation({
            query: (token) => ({
                url: '/menageTeam/acceptInvitation',
                method: 'POST',
                body: JSON.stringify({token})
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(addTeam(data.data.team));
                } catch (error) {
                    console.error('Error kicking member:', error);
                }
            }
        }),
        isLiveInvitation: builder.mutation({
            query: (token) => ({
                url: '/menageTeam/isLiveInvitation',
                method: 'POST',
                body: JSON.stringify({token})
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                } catch (error) {
                    console.error('Error kicking member:', error);
                }
            }
        }),
        cancelInvitation: builder.mutation({
            query: (token) => ({
                url: '/menageTeam/cancelInvitation',
                method: 'POST',
                body: JSON.stringify({token})
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                } catch (error) {
                    console.error('Error kicking member:', error);
                }
            }
        })
    })
});

export const {
    useGetTeamMutation,
    useInviteUserMutation,
    useRevokeInvitationMutation,
    useKickMemberMutation,
    useAcceptInvitationMutation,
    useIsLiveInvitationMutation,
    useCancelInvitationMutation,
} = menageTeamApi;