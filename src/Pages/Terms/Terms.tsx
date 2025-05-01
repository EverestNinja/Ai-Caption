import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Terms = () => {
  const { isDarkMode } = useTheme();

  return (
    <Container
      maxWidth="lg"
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        pt: { xs: 4, sm: 6, md: 8 },
        pb: { xs: 6, sm: 8, md: 10 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          fontWeight: 700,
          textAlign: 'center',
          mb: { xs: 4, sm: 5 },
          color: isDarkMode ? '#fff' : '#000',
        }}
      >
        Terms of Service
      </Typography>

      <Box
        sx={{
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          borderRadius: '16px',
          p: { xs: 3, sm: 4 },
          border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
            mb: 4,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.7,
          }}
        >
          By using the Glocap AI web application ("Service"), you agree to the following terms and conditions:
        </Typography>

        {/* 1. Acceptance of Terms */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.4rem', sm: '1.6rem' },
            fontWeight: 600,
            mb: 2,
            color: isDarkMode ? '#fff' : '#000',
          }}
        >
          1. Acceptance of Terms
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
            mb: 4,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.7,
          }}
        >
          By accessing or using our Service, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
        </Typography>

        {/* 2. Use of Service */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.4rem', sm: '1.6rem' },
            fontWeight: 600,
            mb: 2,
            color: isDarkMode ? '#fff' : '#000',
          }}
        >
          2. Use of Service
        </Typography>
        <Typography
          component="div"
          sx={{
            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
            mb: 4,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.7,
          }}
        >
          <ul style={{ paddingLeft: '20px', marginTop: '0' }}>
            <li>You must be at least 18 years old to use this Service.</li>
            <li>You may use our app to generate captions and flyers for your social media content.</li>
            <li>You may post content to your Facebook account using our Service, provided you have the rights to do so.</li>
            <li>You must comply with Facebook's Community Standards and Platform Policies when creating and posting content.</li>
            <li>You agree not to use the Service for any illegal purpose or in violation of any local, state, national, or international law.</li>
            <li>You agree not to use the Service to generate content that is discriminatory, offensive, or harmful.</li>
          </ul>
        </Typography>

        {/* 3. Content Ownership */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.4rem', sm: '1.6rem' },
            fontWeight: 600,
            mb: 2,
            color: isDarkMode ? '#fff' : '#000',
          }}
        >
          3. Content Ownership
        </Typography>
        <Typography
          component="div"
          sx={{
            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
            mb: 4,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.7,
          }}
        >
          <ul style={{ paddingLeft: '20px', marginTop: '0' }}>
            <li>You retain all rights to the flyers and captions you create using our app.</li>
            <li>By using our app, you grant us a limited license to use your content solely for the purpose of providing the Service, which includes posting it to your Facebook account on your behalf.</li>
            <li>You are responsible for ensuring that you have the necessary rights to any images, logos, or other content you upload to our Service.</li>
          </ul>
        </Typography>

        {/* 4. Subscription and Payments */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.4rem', sm: '1.6rem' },
            fontWeight: 600,
            mb: 2,
            color: isDarkMode ? '#fff' : '#000',
          }}
        >
          4. Subscription and Payments
        </Typography>
        <Typography
          component="div"
          sx={{
            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
            mb: 4,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.7,
          }}
        >
          <ul style={{ paddingLeft: '20px', marginTop: '0' }}>
            <li>Some features of the Service may require a paid subscription.</li>
            <li>Subscription fees are charged in advance and are non-refundable.</li>
            <li>You can cancel your subscription at any time, but no refunds will be provided for the current billing period.</li>
            <li>We reserve the right to change our pricing at any time. Any price changes will take effect at the start of the next billing period.</li>
          </ul>
        </Typography>

        {/* Remaining sections... */}
        {/* 5. Limitation of Liability */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.4rem', sm: '1.6rem' },
            fontWeight: 600,
            mb: 2,
            color: isDarkMode ? '#fff' : '#000',
          }}
        >
          5. Limitation of Liability
        </Typography>
        <Typography
          component="div"
          sx={{
            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
            mb: 4,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.7,
          }}
        >
          <ul style={{ paddingLeft: '20px', marginTop: '0' }}>
            <li>The Service is provided "as is" without warranties of any kind, either express or implied.</li>
            <li>We are not responsible for any issues arising from your use of our app, including but not limited to errors in posting to Facebook or any disputes with other users.</li>
            <li>We are not liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.</li>
            <li>You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your use of the app.</li>
          </ul>
        </Typography>

        {/* 6. Facebook Platform Policy Compliance */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.4rem', sm: '1.6rem' },
            fontWeight: 600,
            mb: 2,
            color: isDarkMode ? '#fff' : '#000',
          }}
        >
          6. Facebook Platform Policy Compliance
        </Typography>
        <Typography
          component="div"
          sx={{
            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
            mb: 4,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.7,
          }}
        >
          <ul style={{ paddingLeft: '20px', marginTop: '0' }}>
            <li>Our Service interacts with the Facebook platform and adheres to Facebook's Platform Policy.</li>
            <li>We do not sell, rent, or lease your Facebook data to any third party.</li>
            <li>We only access the data necessary to provide our service (posting content to your Facebook account) and only with your explicit permission.</li>
            <li>You can revoke our access to your Facebook account at any time through your Facebook settings.</li>
          </ul>
        </Typography>

        {/* 7. Termination */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.4rem', sm: '1.6rem' },
            fontWeight: 600,
            mb: 2,
            color: isDarkMode ? '#fff' : '#000',
          }}
        >
          7. Termination
        </Typography>
        <Typography
          component="div"
          sx={{
            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
            mb: 4,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.7,
          }}
        >
          <ul style={{ paddingLeft: '20px', marginTop: '0' }}>
            <li>We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including if you violate these terms or Facebook's policies.</li>
            <li>Upon termination, your right to use the Service will immediately cease.</li>
          </ul>
        </Typography>

        {/* 8. Changes to Terms */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.4rem', sm: '1.6rem' },
            fontWeight: 600,
            mb: 2,
            color: isDarkMode ? '#fff' : '#000',
          }}
        >
          8. Changes to Terms
        </Typography>
        <Typography
          component="div"
          sx={{
            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
            mb: 4,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.7,
          }}
        >
          <ul style={{ paddingLeft: '20px', marginTop: '0' }}>
            <li>We reserve the right to modify or replace these terms at any time.</li>
            <li>We will make reasonable efforts to notify you of any significant changes.</li>
            <li>Your continued use of the Service after any such changes constitutes your acceptance of the updated terms.</li>
          </ul>
        </Typography>

        {/* 9. Governing Law */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.4rem', sm: '1.6rem' },
            fontWeight: 600,
            mb: 2,
            color: isDarkMode ? '#fff' : '#000',
          }}
        >
          9. Governing Law
        </Typography>
        <Typography
          sx={{
            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
            mb: 4,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.7,
          }}
        >
          These terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
        </Typography>

        {/* 10. Contact Us */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.4rem', sm: '1.6rem' },
            fontWeight: 600,
            mb: 2,
            color: isDarkMode ? '#fff' : '#000',
          }}
        >
          10. Contact Us
        </Typography>
        <Typography
          sx={{
            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.7,
          }}
        >
          If you have any questions about these Terms of Service, please contact us at support@glocap.ai.
        </Typography>
      </Box>
    </Container>
  );
};

export default Terms; 