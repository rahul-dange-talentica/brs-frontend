import { Box, Button, Typography } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { 
  showSuccessNotification, 
  showErrorNotification, 
  setTheme,
  selectNotifications,
  selectTheme 
} from '../../store/uiSlice';

const ReduxTest = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const theme = useAppSelector(selectTheme);

  const handleShowSuccess = () => {
    dispatch(showSuccessNotification('Redux is working perfectly!'));
  };

  const handleShowError = () => {
    dispatch(showErrorNotification('This is a test error notification'));
  };

  const handleToggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Redux Store Test Component
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Current Theme: {theme}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Active Notifications: {notifications.length}
      </Typography>
      
      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button variant="contained" color="success" onClick={handleShowSuccess}>
          Test Success Notification
        </Button>
        
        <Button variant="contained" color="error" onClick={handleShowError}>
          Test Error Notification
        </Button>
        
        <Button variant="outlined" onClick={handleToggleTheme}>
          Toggle Theme
        </Button>
      </Box>
      
      {notifications.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Recent Notifications:</Typography>
          {notifications.slice(-3).map((notification) => (
            <Typography 
              key={notification.id} 
              variant="body2" 
              sx={{ 
                color: notification.type === 'error' ? 'error.main' : 'success.main',
                fontStyle: 'italic' 
              }}
            >
              • {notification.message}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ReduxTest;
