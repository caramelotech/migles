export type RsvpStatus = 'pending' | 'confirmed' | 'declined' | 'waitlisted'

export type Attendee = {
  initials: string
  color: string
  name?: string
}

export type CommentReply = {
  id: string
  author: string
  initials: string
  color: string
  text: string
  time: string
}

export type Comment = {
  id: string
  author: string
  initials: string
  color: string
  text: string
  time: string
  replies: CommentReply[]
}

export type Community = {
  id: string
  name: string
  members: number
  color: string
  type: 'public' | 'private'
}

export type CommunityMember = {
  name: string
  initials: string
  color: string
  role: 'admin' | 'member'
}

export type Event = {
  id: string
  title: string
  description: string
  dateLabel: string
  time: string
  location: string
  capacity: number | null
  rsvpCount: number
  waitlistCount: number
  myRsvp: RsvpStatus
  community: Community
  organizer: { name: string; initials: string; color: string }
  attendees: Attendee[]
  comments: Comment[]
}

export type Me = {
  name: string
  initials: string
  color: string
  bio: string
  eventsCount: number
  communitiesCount: number
}
