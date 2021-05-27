import { useContext, useState } from "react"
import styled from "styled-components"
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import UserContext from "../Context/UserContext";
import { Link, useHistory } from "react-router-dom";
import SelectedContext from "../Context/SelectedContext"


function Header(){
    const [press, setPress] = useState(false);
    const { user } = useContext(UserContext);
    const {setSelected} = useContext(SelectedContext);    
    const history = useHistory();

    function UpdateUser(){
        setSelected(user.username);
        history.push(`/user/${user.id}`)
    }

    return(
        <>
            <Main>
                <Link to={"/timeline"}>
                    <h1>linkr</h1>
                </Link>
                <Arrow onClick={()=>setPress(!press)}>
                    <h2> {press ? <IoIosArrowUp/> : <IoIosArrowDown/>}    </h2>
                    <img src={user.avatar} alt={user.avatar}></img>
                </Arrow>
            </Main>
            <BlockMain press={press} onClick={()=> setPress(false)} >
                <HeaderMenu>
                        <p onClick={()=>UpdateUser()}>My posts</p>
                    <Link to={"/user/liked"}>
                        <p>My likes</p>
                    </Link>
                    <Link to={"/"}>
                        <p>Logout</p>
                    </Link>
                </HeaderMenu>
            </BlockMain>
        </>
    )
}

const Main = styled.div`
    width: 100%;
    height: 72px;
    background-color: #151515;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    z-index: 3;
    h1{
        padding-left: 30px;
        color: #fff;
        font-family: "Passion One";
        font-weight: 700;
        font-size: 49px;
    }
    svg{
        color: #fff;
        font-size: 30px;
        padding-right: 10px;
    }

`

const Arrow = styled.div`
    display: flex;
    align-items: center;
    padding-right: 15px;
    img{
        width: 53px;
        height: 53px;
        border-radius: 50px;
    }
`

const BlockMain = styled.div`
    display: ${props => props.press ? "flex" : "none"};
    width: 100vw;
    min-height: calc(100vh - 72px);
    margin-top: 72px;
    opacity: 1;
    position: fixed;
    background-color: transparent;
    z-index: 5;
`

const HeaderMenu = styled.div`
    background-color: #151515;
    width: 150px;
    height: 109px;
    display: flex;
    flex-direction: column;
    margin-left: auto;
    border-radius: 0px 0px 20px 20px;
    font-family: "Lato";
    font-weight: 700;
    align-items: center;
    p{
        color: #fff;
        cursor: pointer;
        padding-top: 15px;
        width: fit-content;
    }
    a{
        width: fit-content;
    }
`

export default Header