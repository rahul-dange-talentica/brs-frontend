import { CssBaseline, Container, Typography, Box } from '@mui/material';

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom color="primary">
            📚 Book Review Platform
          </Typography>
          <Typography variant="h5" component="h2" color="text.secondary">
            Welcome to the Book Review Platform MVP
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Project setup complete. Ready for Theme & Layout implementation.
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default App;
