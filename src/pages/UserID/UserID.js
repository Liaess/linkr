import { useEffect, useState, useContext } from "react";
import axios from "axios";
import styled from "styled-components";
import Loading from "../../components/Loading";
import Post from "../../components/Post";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import UserContext from "../../Context/UserContext";
import InternalError from "../../components/InternalError";
import Aside from "../../components/Aside";
import SearchBar from "../../components/SearchBar";
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from "react-loader-spinner";
import useInterval from "use-interval";

export default function UserID() {
    const [isWaitingServer, setIsWaitingServer] = useState(true);
    const { idUser, name } = useParams();
    const [posts, setPosts] = useState([]);
    const { user } = useContext(UserContext);
    const [internalError, setInternalError] = useState(false);
    const history = useHistory();
    const [follower, setFollower] = useState(true);
    const [mypost, setMyPost] = useState(false);
    const [disable, setDisable] = useState(false);
    const [loadMore, setLoadMore] = useState(true);
    const url = `${process.env.REACT_APP_API_BASE_URL}/users/${idUser}/posts`;

    useEffect(() => {
        updateList();
        getFollows();
    }, [name]); //eslint-disable-line 

    function goToProfile(id, name) {
        history.push(`/user/${id}/${name}`);
    }

    function goToHashtag(hashtag) {
        history.push(`/hashtag/${hashtag.replace("#", "")}`);
    }

    function updateList(flag, previousList) {
        if (!flag) {
            const promise = axios.get(url, {
                headers: { Authorization: `Bearer ${user.token}` },
                params: { offset: (previousList ? previousList.length : 0) }
            });
            promise.then(({ data }) => {
                const newList = [].concat(previousList ? previousList : [], data.posts);

                if (newList.length >= posts.length) {
                    setPosts(newList);
                    updateList("STOP");
                } else {
                    updateList(false, newList);
                }
                setIsWaitingServer(false);
            });
            promise.catch(() => {
                setIsWaitingServer(false);
                setInternalError(false);
            });
        }
    }

    function morePosts() {
        const promise = axios.get(url, {
            headers: { Authorization: `Bearer ${user.token}` },
            params: { offset: `${posts.length}` }
        });
        promise.then(({ data }) => {
            if (data.posts.length < 10 || !data.posts.length) setLoadMore(false);
            if (data.posts.length) setPosts(posts.concat(data.posts));
        });
        promise.catch(() => setInternalError(true));
    }

    function getFollows() {
        const promise = axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/follows`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
        promise.then((response) => {
            setIsWaitingServer(false)
            if (parseInt(idUser) === user.id) {
                setMyPost(true);
            } else {
                if (response.data.users.map(i => i.id).includes(parseInt(idUser))) {
                    setFollower(true)
                } else {
                    setFollower(false)
                }
            }

        });
    }

    useInterval(() => {
        updateList()
    }, 15000)

    function Follow() {
        setDisable(true);
        const promise = axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/${idUser}/follow`, {}, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });
        promise.then(() => {
            getFollows();
            setDisable(false);
        })
        promise.catch(() => {
            setDisable(false);
            getFollows();
            alert("Não foi possivel executar a operação!");
        })
    }

    function Unfollow() {
        setDisable(true);
        const promise = axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/${idUser}/unfollow`, {}, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });
        promise.then(() => {
            getFollows();
            setDisable(false);
        })
        promise.catch(() => {
            setDisable(false);
            getFollows();
            alert("Não foi possivel executar a operação!");
        })
    }

    return (
        <Main>
            {isWaitingServer ? <Loading /> : internalError ? <InternalError /> :
                <Content>
                    <SearchBar type="innerSearch" />
                    {isWaitingServer ? "" :
                        <TittleHeader>
                            <h2>{name}’s posts</h2>
                            <ButtonFollow mypost={mypost} disabled={disable} follower={follower} onClick={() => Follow()}>Follow</ButtonFollow>
                            <ButtonUnfollow mypost={mypost} disabled={disable} follower={follower} onClick={() => Unfollow()} >Unfollow</ButtonUnfollow>
                        </TittleHeader>
                    }
                        <Columns>
                            <Posts>

                                <InfiniteScroll
                                    dataLength={posts.length}
                                    next={morePosts}
                                    hasMore={loadMore}
                                    style={{ overflow: "hidden" }}
                                    loader={
                                        <LoadingMorePosts key={`LoaderKeyUser${idUser}`}>
                                            <Loader
                                                type="ThreeDots"
                                                color="#171717"
                                                height={50}
                                                width={50}
                                            />
                                        </LoadingMorePosts>
                                    }
                                >
                                    {posts.length ?
                                        posts.map((post, index) => <Post key={index} post={post} goToProfile={goToProfile} goToHashtag={goToHashtag} updateList={updateList} />)
                                        :
                                        <h3 className="info">"Nenhum post encontrado com esta hashtag..."</h3>
                                    }
                                </InfiniteScroll>
                            </Posts>
                            <Aside user={user} posts={posts} />
                        </Columns>
                </Content>
            }
        </Main >
    );
}

const Main = styled.main`
    display: flex;
    justify-content: center;
    padding: 125px 0 50px 0;
    min-height: 100vh;
    background-color: #2F2F2F;
    @media(max-width: 855px) {
        padding-top: 100px;
    }
`;

const Content = styled.div`
    width: 937px;
    h2 {
        color: #fff;
        font-family: "Oswald";
        font-size: 43px;
        font-weight: 700;
        user-select: none;
    }
    @media(max-width: 937px){
        width: 100%;
        h2 {
            margin-left: 20px;
        }
    }
`;

const Columns = styled.div`
    display: flex;
    justify-content: space-between;
    height: inherit;
    margin-top: 43px;
    &>div{
        margin-top: 30px;
    }
`;

const Posts = styled.section`
    width: 611px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    h3.error {
        color: #FFF;
        font-size: 24px;
        font-family: "Oswald";
    }

    @media(max-width: 937px){
        margin: 0 auto;
    }
    @media(max-width: 611px){
        width: 100%;
        
        h3.error{
            margin-left: 20px;
        }
    }

`;

const TittleHeader = styled.div`
    display: flex;
    position: relative;
`;
const ButtonFollow = styled.button`
    display: ${props => props.mypost ? "none" : props.follower ? "none" : "block"};
    min-width: 112px;
    height: 31px;
    border-radius: 5px;
    background-color: #1877F2;
    position: absolute;
    right: 0;
    top: 15px;
    border: none;
    color: #fff;
    font-family: Lato;
    font-weight: 700;
    font-size: 14px;
`;

const ButtonUnfollow = styled.button`
    display: ${props => props.mypost ? "none" : props.follower ? "block" : "none"};
    min-width: 112px;
    height: 31px;
    border-radius: 5px;
    background-color: #fff;
    position: absolute;
    right: 0;
    top: 15px;
    border: none;
    color: #1877F2;
    font-family: Lato;
    font-weight: 700;
    font-size: 14px;
`;

const LoadingMorePosts = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin-top: 40px;
`;