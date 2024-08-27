'use client;'

import HomeCard from './HomeCard'
import { useState } from 'react'
import { useRouter } from 'next/navigation';

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
  'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>(undefined)


  return (
    <section className="grid grid-cols-1 gap-5
      md:grid-cols-2 xl:grid-cols-4">
        <HomeCard 
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState
          ('isJoiningMeeting')} 
          className='bg-orange-1'
          />
        <HomeCard   img="/icons/schedule.svg"
        title="New Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState
          ('isScheduleMeeting')} 
          className='bg-blue-1'
          />
        <HomeCard   img="/icons/recordings.svg"
        title="Recorded Meetings"
        description="View your recorded meetings"
        handleClick={() => router.push('/recordings')}
        className='bg-purple-1' 
          />
        <HomeCard   img="/icons/join-meeting.svg"
        title="New Meeting"
        description="Via invitation link"
        handleClick={() => setMeetingState
          ('isJoiningMeeting')} 
          className='bg-yellow-1'
          />
      </section>
  )
}

export default MeetingTypeList