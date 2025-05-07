'use client';

import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import BookSessionDialog from './BookSessionDialog'; // Import the dialog component

export default function UserCard({ user }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false); // State for dialog

  const {
    name,
    students,
    experience_years: experience,
    profile_picture,
    languages = [],
    grade_levels: grades = [],
    subjects = [],
    hourly_rate: price,
    bio,
    teacher_id,
  } = user;

  const linkTo = paths.dashboard.user.id(teacher_id);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card sx={{ 
        textAlign: 'left', 
        padding: 2, 
        width: '100%',  // Make card responsive
        maxWidth: { xs: '100%', sm: 320 },  // Responsive max-width
        boxShadow: 3 
      }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            alt={name}
            src={profile_picture}
            sx={{
              width: 64,
              height: 64,
            }}
          />
          <Box>
            <Link component={RouterLink} href={linkTo} color="inherit" variant="subtitle2" noWrap>
              {name}
            </Link>
            <Typography variant="body2" color="text.secondary">
              {experience} yr. experience | {students} students
            </Typography>
          </Box>
        </Stack>

        <Typography
  variant="body1"
  sx={{ 
    mt: 2, 
    mb: 2, 
    minHeight: '40px',  // Adjust based on design preference
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2, // Limits text to 2 lines
    WebkitBoxOrient: 'vertical'
  }}
>
  {bio && typeof bio === 'string'
    ? bio.split(' ').length >= 10
      ? `${bio.split(' ').slice(0, 6).join(' ')}...`
      : bio
    : 'No bio available.'}
</Typography>


        <Divider sx={{ my: 2 }} />

        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Languages
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>  {/* Allow wrapping */}
            {languages.map((curr, index) => (
              <Chip 
                key={index} 
                label={curr} 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ mb: 1 }}  // Add margin bottom for wrapped items
              />
            ))}
          </Stack>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
            Grades
          </Typography>
          <Stack direction="row" spacing={1}>
            {grades.map((grade, index) => (
              <Chip key={index} label={grade} size="small" variant="outlined"
              sx={{
                color: '#81C784',
                borderColor: '#81C784',
              }}
              />
            ))}
          </Stack>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
            Subjects
          </Typography>
          <Stack direction="row" spacing={1}>
            {subjects.map((subject, index) => (
              <Chip key={index} label={subject} size="small" variant="outlined"
              sx={{
                color: '#80CBC4', 
                borderColor: '#80CBC4', 
              }}
              />
            ))}
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold' }}>
            ${price} /session
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Book Now
          </Button>
        </Stack>
      </Card>

      {/* Book Session Dialog */}
      <BookSessionDialog teacher_id={teacher_id} open={open} onClose={handleClose} />
    </>
  );
}

UserCard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    experience_years: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    students: PropTypes.number.isRequired,
    profile_picture: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string),
    grade_levels: PropTypes.arrayOf(PropTypes.string),
    subjects: PropTypes.arrayOf(PropTypes.string),
    hourly_rate: PropTypes.number,
    teacher_id: PropTypes.number,
  }).isRequired,
};
