import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  Divider,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Careers', path: '/careers' },
      { label: 'Blog', path: '/blog' },
    ],
    resources: [
      { label: 'Help Center', path: '/help' },
      { label: 'Community Guidelines', path: '/guidelines' },
      { label: 'API Documentation', path: '/api-docs' },
      { label: 'Book Suggestions', path: '/suggest-book' },
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
      { label: 'DMCA', path: '/dmca' },
    ],
  };

  const socialLinks = [
    { icon: GitHubIcon, url: 'https://github.com', label: 'GitHub' },
    { icon: TwitterIcon, url: 'https://twitter.com', label: 'Twitter' },
    { icon: LinkedInIcon, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: EmailIcon, url: 'mailto:contact@bookreview.com', label: 'Email' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.dark',
        color: 'primary.contrastText',
        mt: 'auto',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                📚 BookReview
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, opacity: 0.8, lineHeight: 1.6 }}>
                Discover your next favorite book through community-driven reviews and 
                recommendations. Join thousands of readers sharing their literary journey.
              </Typography>
              
              {/* Social Links */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.label}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      color: 'primary.contrastText',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <social.icon fontSize="small" />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Link Sections */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {/* Company Links */}
              <Grid item xs={6} md={4}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    fontSize: '1.125rem',
                  }}
                >
                  Company
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {footerLinks.company.map((link) => (
                    <Box component="li" key={link.label} sx={{ mb: 1 }}>
                      <MuiLink
                        component={Link}
                        to={link.path}
                        color="inherit"
                        underline="none"
                        sx={{
                          opacity: 0.8,
                          fontSize: '0.875rem',
                          '&:hover': {
                            opacity: 1,
                            textDecoration: 'underline',
                          },
                          transition: 'opacity 0.2s ease-in-out',
                        }}
                      >
                        {link.label}
                      </MuiLink>
                    </Box>
                  ))}
                </Box>
              </Grid>

              {/* Resources Links */}
              <Grid item xs={6} md={4}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    fontSize: '1.125rem',
                  }}
                >
                  Resources
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {footerLinks.resources.map((link) => (
                    <Box component="li" key={link.label} sx={{ mb: 1 }}>
                      <MuiLink
                        component={Link}
                        to={link.path}
                        color="inherit"
                        underline="none"
                        sx={{
                          opacity: 0.8,
                          fontSize: '0.875rem',
                          '&:hover': {
                            opacity: 1,
                            textDecoration: 'underline',
                          },
                          transition: 'opacity 0.2s ease-in-out',
                        }}
                      >
                        {link.label}
                      </MuiLink>
                    </Box>
                  ))}
                </Box>
              </Grid>

              {/* Legal Links */}
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    fontSize: '1.125rem',
                  }}
                >
                  Legal
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {footerLinks.legal.map((link) => (
                    <Box component="li" key={link.label} sx={{ mb: 1 }}>
                      <MuiLink
                        component={Link}
                        to={link.path}
                        color="inherit"
                        underline="none"
                        sx={{
                          opacity: 0.8,
                          fontSize: '0.875rem',
                          '&:hover': {
                            opacity: 1,
                            textDecoration: 'underline',
                          },
                          transition: 'opacity 0.2s ease-in-out',
                        }}
                      >
                        {link.label}
                      </MuiLink>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider 
          sx={{ 
            my: 4, 
            borderColor: 'rgba(255, 255, 255, 0.2)' 
          }} 
        />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 2,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              opacity: 0.7,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            © {currentYear} BookReview Platform. Made with{' '}
            <FavoriteIcon fontSize="small" sx={{ color: 'secondary.main' }} />{' '}
            for book lovers.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1, md: 3 },
              justifyContent: { xs: 'center', md: 'flex-end' },
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Version 1.0.0
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Built with React & Material-UI
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
