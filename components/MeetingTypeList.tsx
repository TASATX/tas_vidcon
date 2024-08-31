'use client;'

import MeetingModal from './MeetingModal';
import HomeCard from './HomeCard'
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import Loader from '@/components/Loader';
import { useToast } from './ui/use-toast';
import { Input } from './ui/input';

const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
  'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>(undefined)    
  const [values, setValues] =useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();  
  const client =useStreamVideoClient();
  const {user} = useUser();
  const {toast} = useToast();

const createMeeting = async () => {
  if(!client || !user)   return;

  try {
    if(!values.dateTime) {
      toast({ title: 'Please select a date and time'})
      return;
    }

    const id = crypto.randomUUID();
    const call = client.call('default', id);
    if(!call) throw new Error('Failed to create meeting');
    const startsAt = 
      values.dateTime.toISOString() || new Date(Date.now()).toISOString();
    const description = values.description || 'Instant Meeting';
    await call.getOrCreate ({
      data: {
        starts_at: startsAt,
        custom: {
          description,
        },
    },
  });
  setCallDetail(call);
  if(!values.description) {
    router.push(`/meeting/${call.id}`)
  }
  toast({ 
    title: 'Meeting Created'})
    } catch (error) {
      console.log(error);
      toast({ title:'Failed to create meeting' });
    }
  };

  if(!client || !user) return <Loader />;

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.callDetail?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5
      md:grid-cols-2 xl:grid-cols-4">
        <HomeCard 
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState
          ('isInstantMeeting')} 
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
        handleClick={() => router.push(`/recordings)}
        className='bg-purple-1' 
          />
        <HomeCard   img="/icons/join-meeting.svg"
        title="New Meeting"
        description="Via invitation link"
        handleClick={() => setMeetingState
          ('isJoiningMeeting')} 
          className='bg-yellow-1'
          />
      {!callDetail ? (    
        <MeetingModal
          isOpen={meetingState === 'isInstantMeeting'}
          onClose={() => setMeetingState(undefined)}
          title='Create Meeting'
          className='text-center'
          buttonText='Start Meeting'
          handleClick={createMeeting}
        />
        <div className="flex flex-col gap-2.5">
          <label className="text-base font-normal leading-[22.4px] text-sky-2">
            Add a description
          </label>
          <textarea
            className='border-none bg-dark-3 focus-visable:ring-offset-0'
            onChange={(e) =>
              setValues({...values, dateTime: date! })}
            showTimeSelect
            timeFormat='HH:mm'
            timeInterval={15}
            timeCaption='time'
            dateFormat='MMMM d, yyyy h:mm aa'
            className='w-full rounded bg-dark-3 p-2 focus:outline-none'
            />
        </div>
      </MeetingModal>
   ) : (
      <MeetingModal>
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Meeting Created"
        handleClick={() => {
          navigator.clipboard.writeText(meetingLink);
          toast({ title: 'Link Copied' });
        }}
        image={'/icons/checked.svg'}
        buttonIcon="/icons/copy.svg"
        className="text-center"
        buttonText="Copy Meeting Link"
        />
      )}
      
      <MeetingModal
      isOpen={meetingState === 'isJoiningMeeting'}
      onClose={() => setMeetingState(undefined)}
      title="Type the link here"
      className="text-center"
      buttonText="Join Meeting"
      handleClick={() => router.push(values.link)}
    >
      <Input
        placeholder="Meeting link"
        onChange={(e) => setValues({ ...values, link: e.target.value })}
        className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </MeetingModal>

    <MeetingModal
      isOpen={meetingState === 'isInstantMeeting'}
      onClose={() => setMeetingState(undefined)}
      title="Start an Instant Meeting"
      className="text-center"
      buttonText="Start Meeting"
      handleClick={createMeeting}
         />      
      </section>
  );
};

export default MeetingTypeList;