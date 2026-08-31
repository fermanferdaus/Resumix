import { GoogleLogin } from "@react-oauth/google";

export const GoogleAuthButton = ({ onSuccess, onError, text = "continue_with" }) => {
  return (
    <div className="w-full flex justify-center items-center overflow-hidden min-h-[44px]">
      <div className="max-w-full flex justify-center">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          shape="rectangular"
          theme="outline"
          size="large"
          text={text}
          locale="id"
        />
      </div>
    </div>
  );
};
