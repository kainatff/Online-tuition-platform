import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import { Card, CircularProgress, Box } from '@mui/material'; 
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from 'src/_mock';
import {
  fetchTeacherByUserId,
  selectTeacher,
  selectTeachersLoading,
  selectTeachersError,
} from '../../app/store/slices/teacherslice'; // Adjust the path if needed
import ProfileHome from './profile-home';
import ProfileCover from './profile-cover'; // Assuming a ProfileCover component exists

// The component will use the teacher data from Redux state
export default function TeacherProfile({ id }) {
  const dispatch = useDispatch();
  const teacher = useSelector(selectTeacher);
  const loading = useSelector(selectTeachersLoading);
  const error = useSelector(selectTeachersError);

  useEffect(() => {
    if (id) {
      dispatch(fetchTeacherByUserId(id)); // Fetch the teacher data based on ID
    }
  }, [id, dispatch]);

  // If data is loading
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
       <LoadingScreen />
      </Box>
    );
  }

  // If there's an error fetching the data
  if (error) {
    return <p>Error: {error}</p>;
  }

  // If teacher data is not found
  if (!teacher) {
    return <p>Teacher not found!</p>;
  }

  return (
    <div>
      <ProfileCover
        role={teacher.role || 'Teacher'}
        name={teacher.name || 'Anonymous'}
        profile_picture={teacher.profile_picture}
        coverUrl={_userAbout.coverUrl}
        city_name={teacher.city_name || 'Unknown'}
        email={teacher.email || 'No email provided'}
        phone_number={teacher.phone_number || 'No phone number provided'}
        teacher_id={id}
        dob={teacher.dob}
      />
        {console.log(teacher)}
      <ProfileHome info={teacher} posts={[]} teacher_id={id} />

    </div>
  );
}

// Add PropTypes for better type checking
TeacherProfile.propTypes = {
  id: PropTypes.string.isRequired,
};

// Fetch teacher ID from URL in getServerSideProps to pass as prop
export async function getServerSideProps(context) {
  const { id } = context.params; // Get teacher ID from the URL

  return {
    props: {
      id, // Pass the teacher ID as a prop
    },
  };
}
