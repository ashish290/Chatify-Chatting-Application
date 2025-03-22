import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/zustand";

const Auth = () => {
  const {setUserInfo} = useAppStore();
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");


  const handleLogin = async () => {
    try {
      const form = {
        email: Email,
        password: Password,
      };
      const res = await apiClient.post(LOGIN_ROUTE, form, {
        withCredentials: true,
      });

      console.log(res.data);
      if(res.data.user.id) {
        setUserInfo(res.data.user);
        console.log(setUserInfo);
        if(res.data.user.profileSetput) {
          navigate('/chat');
        }
        else {
          navigate('/profile');
        }
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const { InvalidUser, required, InvalidPassword } = error.response.data;
        if (status === 400 && required) {
          toast.error(required);
        } else if (status === 404 && InvalidUser) {
          toast.error(InvalidUser);
        } else if (status === 401 && InvalidPassword) {
          toast.error(InvalidPassword);
        }
      }
      console.error("Signup Error:", error);
    }
  };

  const validateSignup = () => {
    if (Password !== confirmPassword) {
      toast.error("Password and Confirm password should be same.");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    try {
      if (validateSignup()) {
        const form = {
          email: Email,
          password: Password,
        };
        const res = await apiClient.post(SIGNUP_ROUTE, form, {
          withCredentials: true,
        });
        const status = res.status;
        const { success } = res.data;

        if (status === 201 && success) {
          setUserInfo(res.data.user);
          navigate("/profile");
        }
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const { Required, userExist, InvalidEmail } = error.response.data || {};
        if (status === 400 && Required) {
          toast.error(Required);
        } else if (status === 409 && userExist) {
          toast.error(userExist);
        } else if(status === 400 && InvalidEmail) {
          toast.error(InvalidEmail);
        }
      } else {
        toast.error(error.message);
      }
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div
        className="h-[90vh] w-[90vw] bg-white border-2 border-white text-opacity-90 shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2"
        style={{ padding: "5vh" }}
      >
        <div>
          <div className="flex flex-col gap-5 items-center justify-center">
            <div className="flex items-center justify-center flex-col">
              <div className="flex items-center justify-center">
                <h1 className="text-5xl font-bold md:text-6xl"> Welcome </h1>
                <img src={Victory} alt="victory Emoji" className="h-[100px]" />
              </div>
              <p className="font-medium text-center">
                Fill in the details to get started with the best chat app!
              </p>
            </div>
            <div className="flex justify-center w-full">
              <Tabs defaultValue="login" className="w-3/4">
                <TabsList className="bg-transparent rounded-none w-full">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  >
                    LogIn
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  >
                    SignUp
                  </TabsTrigger>
                </TabsList>

                <TabsContent className="flex flex-col gap-3" value="login">
                  <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-full p-6"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="rounded-full p-6"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button onClick={handleLogin}>LogIn</Button>
                </TabsContent>

                <TabsContent value="signup" className="flex flex-col gap-3">
                  <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-full p-6"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="rounded-full p-6"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    className="rounded-full p-6"
                    value={confirmPassword}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                  />
                  <Button onClick={handleSignup}>SignUp</Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        <div
          className="hidden xl:flex justify-center items-center bg-cover bg-center rounded-r-3xl"
          style={{ backgroundImage: `url(${Background})` }}
        ></div>
      </div>
    </div>
  );
};

export default Auth;
