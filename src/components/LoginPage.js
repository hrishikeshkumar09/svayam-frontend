// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Button,
//   TextField,
//   Typography,
//   Stack,
//   Divider,
//   CircularProgress,
// } from "@mui/material";
// import MicrosoftIcon from "@mui/icons-material/Microsoft";
// import LoginIcon from "@mui/icons-material/Login";


// import customLogo from "../images/searching.png";

// const LoginPage = ({ onLogin }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Please enter both email and password");
//       return;
//     }

//     setLoading(true);
//     try {
//       await onLogin(email, password); 
//     } catch (err) {
//       setError(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMicrosoftLogin = () => {
//     window.location.href = "/.auth/login/aad"; 
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         padding: 2,
//       }}
//     >
//       <Card sx={{ width: "100%", maxWidth: 450, borderRadius: 2, boxShadow: 5 }}>
//         <CardContent sx={{ p: 4 }}>
//           {/* Logo */}
//           <Stack alignItems="center" spacing={2} mb={3}>
//             <Box
//               component="img"
//               src={customLogo}
//               alt="App Logo"
//               sx={{ height: 64 }}
//             />
//             <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
//               SVAYAM-AMS
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Intelligent Support Specialist
//             </Typography>
//           </Stack>

     
//           {error && (
//             <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
//               {error}
//             </Typography>
//           )}

       
//           <Button
//             variant="contained"
//             fullWidth
//             sx={{ py: 1.4, bgcolor: "#0078d4", "&:hover": { bgcolor: "#005a9e" } }}
//             startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <MicrosoftIcon />}
//             disabled={loading}
//             onClick={handleMicrosoftLogin}
//           >
//             {loading ? "Redirecting..." : "Sign in with Microsoft"}
//           </Button>

//           <Divider sx={{ my: 2 }}>OR</Divider>

//           <form onSubmit={handleSubmit}>
//             <Stack spacing={2}>
//               <TextField
//                 label="Email Address"
//                 type="email"
//                 fullWidth
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={loading}
//               />

//               <TextField
//                 label="Password"
//                 type="password"
//                 fullWidth
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={loading}
//               />

//               <Button
//                 type="submit"
//                 variant="outlined"
//                 fullWidth
//                 sx={{ py: 1.4 }}
//                 disabled={loading}
//                 startIcon={
//                   loading ? <CircularProgress size={20} /> : <LoginIcon />
//                 }
//               >
//                 {loading ? "Signing in..." : "Sign In"}
//               </Button>
//             </Stack>
//           </form>


//           <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
//             <Typography variant="caption" color="text.secondary" display="block">
//               <strong>Demo Accounts:</strong>
//             </Typography>
//             <Typography variant="caption" color="text.secondary" display="block">
//               Admin: <strong>admin@company.com</strong> / <strong>admin123</strong>
//             </Typography>
//             <Typography variant="caption" color="text.secondary" display="block">
//               User: <strong>user@company.com</strong> / <strong>password123</strong>
//             </Typography>
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default LoginPage;

//src/components/LoginPage.js
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import LoginIcon from "@mui/icons-material/Login";

import customLogo from "../images/searching.png";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = () => {
    window.location.href = "/.auth/login/aad";
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        overflow: "hidden", // 🔥 No scroll
      }}
    >
<Box
        sx={{
          width: "50%",
          minWidth: 460,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: 8,
          color: "white",
        }}
      >
        <Box sx={{ maxWidth: 420 }}>
          <Box
            component="img"
            src={customLogo}
            alt="Logo"
            sx={{ height: 80, mb: 3 }}
          />

          <Typography variant="h3" fontWeight={800}>
            iResolver - Copilot
          </Typography>

          <Typography
            variant="h6"
            sx={{
              opacity: 0.85,
              mt: 1,
              mb: 3,
              fontWeight: 400,
            }}
          >
            Intelligent Support Assistant
          </Typography>

          <Typography
            variant="body1"
            sx={{
              opacity: 0.85,
              lineHeight: 1.6,
              fontSize: "17px",
            }}
          >
            {/* Empower your organization with seamless AI-powered support,
            real-time insights, and integrated enterprise workflow automation. */}
            Revolutionize your helpdesk with iResolver - Copilot by integrating intelligent ticket resolution, 
            instant knowledge retrieval, and real-time operational analytics.
          </Typography>
        </Box>
      </Box>

      {/* RIGHT PANEL - Login Form */}
      <Box
        sx={{
          width: "50%",
          minWidth: 450,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <Card
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 3,
            p: 1,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Title */}
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ textAlign: "center", mb: 3 }}
            >
              Sign in to your account
            </Typography>

            {error && (
              <Typography
                color="error"
                sx={{ mb: 2, textAlign: "center", fontSize: "14px" }}
              >
                {error}
              </Typography>
            )}

            {/* Microsoft Login */}
            <Button
              variant="contained"
              fullWidth
              sx={{
                py: 1.3,
                bgcolor: "#5b5ee8",
                "&:hover": { bgcolor: "#514fd3" },
                borderRadius: 2,
                textTransform: "none",
              }}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <MicrosoftIcon />
                )
              }
              disabled={loading}
              onClick={handleMicrosoftLogin}
            >
              {loading ? "Redirecting..." : "Sign in with Microsoft"}
            </Button>

            <Divider sx={{ my: 3 }}>OR</Divider>

            {/* Email Login */}
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />

                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 1.3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    bgcolor: "#6b4cbf",
                    "&:hover": { bgcolor: "#5f42ad" },
                  }}
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <LoginIcon />
                  }
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;
