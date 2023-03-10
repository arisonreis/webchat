import { GetServerSideProps, GetServerSidePropsContext } from 'next/types';
import Head from 'next/head';
import { parseCookies, destroyCookie } from 'nookies';
import { Layout } from '../components/layout';
import { Suspense } from 'react';
import {
  AppContainer,
  ContainerChat,
  AreaUsersConnected,
  LoggedInUser,
  SideBar,
  HeaderChat,
  AreaChat,
  InputToSendMessage,
  SendMessageContainer,
  ButtonSendMessage,
  ButtonSignOut,
} from './home.styles';
import { IoMdSend } from 'react-icons/io';
import { BiLogOut } from 'react-icons/bi';
import { FaUserEdit } from 'react-icons/fa';
import { Roboto } from '@next/font/google';
import { useEffect, useState } from 'react';
import { WebSocketConnection } from '../lib/socketIo/connection';
import { AlertButtonMessage } from '../components/alertButton';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth].api';
import { IPageProps } from '@/@types/PageProps';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loading } from '@/components/loading';
//imports

//font
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  preload: true,
});

//validations
export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const cookies = parseCookies({ req: ctx.req });
  const UserName = cookies['webchat:UserName'];
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session && !UserName) {
    return {
      redirect: {
        destination: '/signin',
        permanent: true,
      },
    };
  }
  return {
    props: {
      cookies,
    },
  };
};
//page
export default function Home({ cookies }: IPageProps) {
  //hooks
  const [message, setMessage] = useState('');
  const { data: dataSession, status: statusSession } = useSession();
  const router = useRouter();

  // const userPerfilUrl =
  const userName = cookies['webchat:UserName'];
  const userEmail = cookies['webchat:Email'];
  const userPerfilUrl = cookies['webchat:Perfil_Url'];

  console.log(userName, userEmail, userPerfilUrl);
  //connecting with webSocketServer
  useEffect(() => {
    // WebSocketConnection();
  }, []);

  console.log(dataSession, statusSession);
  console.log('perfil-url', userPerfilUrl);

  const SendMessage = () => {
    console.log(message);
  };

  const handleSignOut = async () => {
    if (statusSession == 'authenticated') {
      await signOut({
        redirect: true,
      });
      router.push('/signin');
    }

    destroyCookie(null, 'webchat:UserName');
    destroyCookie(null, 'webchat:Email');
    destroyCookie(null, 'webchat:Perfil_Url');
    router.push('/signin');
  };

  return (
    <>
      <Head>
        <title>WebChat | Bate-Papo</title>
        <meta
          name="description"
          content="Generated by create next app"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="shortcut icon"
          href="/favicon.ico"
          type="image/x-icon"
        />
      </Head>

      <Layout svg={false}>
        <AppContainer>
          <SideBar>
            <AreaUsersConnected>
              <h2>Hello world</h2>
            </AreaUsersConnected>
            <Suspense fallback={<h1>carregando</h1>}>
              <LoggedInUser>
                <Image
                  src={
                    userPerfilUrl ??
                    dataSession?.user?.image ??
                    '/avatardefault.svg'
                  }
                  alt="profile"
                  className="profileImage"
                  width={40}
                  height={40}
                />

                <span>{userName ?? dataSession?.user?.name}</span>

                <FaUserEdit />
              </LoggedInUser>
            </Suspense>
          </SideBar>
          <ContainerChat>
            <HeaderChat>
              <ButtonSignOut
                type="button"
                className={roboto.className}
                onClick={handleSignOut}
              >
                <BiLogOut />
                Sair
              </ButtonSignOut>
            </HeaderChat>

            <AreaChat></AreaChat>
            <SendMessageContainer>
              <InputToSendMessage
                type="text"
                placeholder="Digite sua mensagem"
                className={roboto.className}
                onChange={(e) => setMessage(e.target.value)}
              />
              <ButtonSendMessage
                type="button"
                onClick={SendMessage}
              >
                <IoMdSend />
              </ButtonSendMessage>
            </SendMessageContainer>
          </ContainerChat>
        </AppContainer>
      </Layout>
    </>
  );
}
