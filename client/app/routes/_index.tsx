import LandingPage from "~/components/LandingPage";
import IndexPage from "~/components/IndexPage";
import { AppLayout } from "~/components/layouts/AppLayout";
import { AuthLayout } from "~/components/layouts/AuthLayout";

export default function Index() {
  const isAuth = false;
  return (
    <>
      {isAuth ?
        (
          <AppLayout>
            <IndexPage />
          </AppLayout>
        )
        :
        (
          <AuthLayout >
            < LandingPage />
          </AuthLayout>
        )
      }
    </>
  )
}