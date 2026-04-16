import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Home } from "lucide-react";

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success(t('admin.login.loginSuccess'));
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success(t('admin.login.createSuccess'));
      }
      navigate(`/${i18n.language}/admin/dashboard`);
    } catch (error: any) {
      toast.error(error.message || t('admin.login.authFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-muted/30 p-4 ${i18n.language === 'ar' ? 'font-arabic' : ''}`} dir={i18n.dir()}>
      <div className="absolute top-4 start-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/${i18n.language}`)} 
          className="gap-2 bg-background/50 backdrop-blur"
        >
          <Home className="w-4 h-4" />
          {t('nav.home')}
        </Button>
      </div>
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold font-serif">{t('admin.login.title')}</CardTitle>
          <CardDescription>
            {isLogin 
              ? t('admin.login.signInSubtitle') 
              : t('admin.login.createAccountSubtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('admin.login.email')}</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder={t('admin.login.emailPlaceholder')} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('admin.login.password')}</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full font-semibold" 
              disabled={isLoading}
            >
              {isLoading 
                ? t('admin.login.loading') 
                : (isLogin ? t('admin.login.signInButton') : t('admin.login.createAccountButton'))}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
          >
            {isLogin 
              ? t('admin.login.noAccount') 
              : t('admin.login.hasAccount')}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
