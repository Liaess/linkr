import { useEffect, useState, useContext } from "react";
import axios from "axios";
import styled from "styled-components";
import Loading from "../../components/Loading";
import Post from "../../components/Post";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import UserContext from "../../Context/UserContext";
import SelectedContext from "../../Context/SelectedContext";
import InternalError from "../../components/InternalError";
import Aside from "../../components/Aside";



export default function UserID() {
    const [isWaitingServer, setIsWaitingServer] = useState(true);
    const { idUser } = useParams();
    const [posts, setPosts] = useState([]);
    const { user } = useContext(UserContext);
    const [internalError, setInternalError] = useState(false);
    const history = useHistory();
    const { selected, setSelected } = useContext(SelectedContext);

    useEffect(() => {
        updateList();
    }, []); //eslint-disable-line 

    function goToProfile(id, nome) {
        setSelected(nome);
        history.push(`/user/${id}`);
    }

    function goToHashtag(hashtag) {
        history.push(`/hashtag/${hashtag.replace("#", "")}`);
    }

    function updateList() {
        const promise = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${idUser}/posts`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        });
        promise.then(({ data }) => {
            setPosts(data.posts);
            setIsWaitingServer(false);
        });
        promise.catch(error => {
            setIsWaitingServer(false);
            setInternalError(true);
        });
    }

    return (
        <Main>
            <Content>
                <h2>{selected}’s posts</h2>
                {isWaitingServer ? <Loading /> : internalError ? <InternalError /> :
                    <Columns>

                        <Posts>

                    

                            {posts.length > 0 ?
                                posts.map((post, index) => <Post key={index} post={post} goToProfile={goToProfile} goToHashtag={goToHashtag} updateList={updateList} />)
                                :
                                <h3 className="error">Nenhum post encontrado...</h3>
                            }
                        </Posts>

                        <Aside user={user} posts={posts} />

                    </Columns>

                }

            </Content>
        </Main>
    );
}

const Main = styled.main`
display: flex;
justify-content: center;
padding: 125px 0 50px 0;
min-height: 100vh;
background-color: #2F2F2F;
`;

const Content = styled.div`
width: 937px;
h2 {
    color: #fff;
    font-family: "Oswald";
    font-size: 43px;
    font-weight: 700;
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
@media(max-width: 937px){
    &>aside {
        display: none;
    }
}
`;

const Posts = styled.section`
width: 611px;
display: flex;
flex-direction: column;
gap: 16px;
@media(max-width: 937px){
    margin: 0 auto;
}
@media(max-width: 611px){
    width: 100%;
}
h3.error {
    color: #FFF;
    font-size: 24px;
    font-family: "Oswald";

}

`;

