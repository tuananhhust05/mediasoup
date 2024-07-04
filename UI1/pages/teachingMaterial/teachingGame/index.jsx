import styles from './styles.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Pagination from '@/components/home/pagination/pagination';
import { Modal, Button } from 'react-bootstrap';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';

const ListGameTypes = [
    {
        id: 0,
        name: 'Game PPT Tiếng Anh',
    },
    {
        id: 1,
        name: 'Game PPT Tiếng Việt',
    },
]
const games = [
    {
        id: 0,
        type: 0,
        name: 'Class Room Object',
        des: 'Is a game',
        img: '/gameImg/classRomeObject.png',
        link: '',
    },
    {
        id: 1,
        type: 0,
        name: 'Christmas Vocalbulary',
        des: 'Is a game',
        img: '/gameImg/chrimasVocalbulary.png',
        link: '',
    },
    {
        id: 2,
        type: 0,
        name: 'Directions Driving',
        des: 'Is a game',
        img: '/gameImg/directionsDriving.png',
        link: '',
    },
    {
        id: 3,
        type: 0,
        name: 'Simple Past Tense',
        des: 'Is a game',
        img: '/gameImg/simplePastTense.png',
        link: '',
    },
    {
        id: 4,
        type: 0,
        name: 'Discover The Animals',
        des: 'Is a game',
        img: '/gameImg/discoverTheAnimals.png',
        link: '',
    },
    {
        id: 5,
        type: 0,
        name: 'Get Dressed',
        des: 'Is a game',
        img: '/gameImg/getDressed.png',
        link: '',
    },
    {
        id: 6,
        type: 0,
        name: 'Giving Directions',
        des: 'Is a game',
        img: '/gameImg/givingDirections.png',
        link: '',
    },
    {
        id: 7,
        type: 0,
        name: 'Class Room Object',
        des: 'Is a game',
        img: '/gameImg/classRomeObject.png',
        link: '',
    },
    {
        id: 8,
        type: 0,
        name: 'Irregular Verb Machine',
        des: 'Is a game',
        img: '/gameImg/irregularVerbMachine.png',
        link: '',
    },
    {
        id: 9,
        type: 1,
        name: 'Ai Là Triệu Phú',
        des: 'Is a game',
        img: '/gameImg/aiLaTrieuPhu.png',
        link: '',
    },
    {
        id: 10,
        type: 1,
        name: 'Đào Vàng',
        des: 'Is a game',
        img: '/gameImg/daoVang.png',
        link: '',
    },
    {
        id: 11,
        type: 1,
        name: 'Giải Cứu Đại Dương',
        des: 'Is a game',
        img: '/gameImg/giaiCuuDaiDuong.png',
        link: '',
    },
    {
        id: 12,
        type: 1,
        name: 'Rung Chuông Vàng',
        des: 'Is a game',
        img: '/gameImg/rungChuongVang.png',
        link: '',
    },
    {
        id: 13,
        type: 1,
        name: 'Vòng Quay Kì Diệu',
        des: 'Is a game',
        img: '/gameImg/vongQuayKiDieu.png',
        link: '',
    },
    {
        id: 14,
        type: 1,
        name: 'Chuột Hamster',
        des: 'Is a game',
        img: '/gameImg/chuotHamster.png',
        link: '',
    },
    {
        id: 15,
        type: 1,
        name: 'Cọp ơi cậu ở đâu thế',
        des: 'Is a game',
        img: '/gameImg/copOi.png',
        link: '',
    },
    {
        id: 16,
        type: 0,
        name: 'Modal Web',
        des: 'Is a game',
        img: '/gameImg/modalWeb.png',
        link: '',
    },
    {
        id: 17,
        type: 0,
        name: 'Number Machine',
        des: 'Is a game',
        img: '/gameImg/numberMachine.png',
        link: '',
    },
    {
        id: 18,
        type: 0,
        name: 'Milionare',
        des: 'Is a game',
        img: '/gameImg/milionare.png',
        link: '',
    },
    {
        id: 19,
        type: 0,
        name: 'Prepositions Of Time',
        des: 'Is a game',
        img: '/gameImg/prepositionsOfTime.png',
        link: '',
    },
    {
        id: 20,
        type: 0,
        name: 'Present Simple Continuous',
        des: 'Is a game',
        img: '/gameImg/presentSimpleContinuous.png',
        link: '',
    },
    {
        id: 21,
        type: 0,
        name: 'Question Words',
        des: 'Is a game',
        img: '/gameImg/questionWords.png',
        link: '',
    },
    {
        id: 22,
        type: 0,
        name: 'Routines Quiz',
        des: 'Is a game',
        img: '/gameImg/routinesQuiz.png',
        link: '',
    },
    {
        id: 23,
        type: 0,
        name: 'Routines Time',
        des: 'Is a game',
        img: '/gameImg/routinesTime.png',
        link: '',
    },
    {
        id: 24,
        type: 0,
        name: 'Spot The Difference',
        des: 'Is a game',
        img: '/gameImg/spotTheDifference.png',
        link: '',
    },
    {
        id: 25,
        type: 0,
        name: 'Must Mustnt',
        des: 'Is a game',
        img: '/gameImg/mustMustnt.png',
        link: '',
    },
    {
        id: 26,
        type: 0,
        name: 'Part Of The Body',
        des: 'Is a game',
        img: '/gameImg/partOfTheBody.png',
        link: '',
    },
    {
        id: 27,
        type: 0,
        name: 'Animals Guess',
        des: 'Is a game',
        img: '/gameImg/animalsGuess.png',
        link: '',
    },
    {
        id: 28,
        type: 0,
        name: 'Compartives And Superlatives',
        des: 'Is a game',
        img: '/gameImg/compartivesAndSuperlatives.png',
        link: '',
    },
    {
        id: 29,
        type: 0,
        name: 'Daily Routines',
        des: 'Is a game',
        img: '/gameImg/dailyRoutines.png',
        link: '',
    },
    {
        id: 30,
        type: 0,
        name: 'Old MacDonald Farm',
        des: 'Is a game',
        img: '/gameImg/oldMacDonaldFarm.png',
        link: '',
    },
    {
        id: 31,
        type: 0,
        name: 'Fast Food Wheel',
        des: 'Is a game',
        img: '/gameImg/fastFoodWheel.png',
        link: '',
    },
    {
        id: 32,
        type: 0,
        name: 'Jeoparody',
        des: 'Is a game',
        img: '/gameImg/jeoparody.png',
        link: '',
    },
    {
        id: 33,
        type: 0,
        name: 'Mr HowMuch Vs Mr How Many',
        des: 'Is a game',
        img: '/gameImg/mrHowMuchVsMrHowMany.png',
        link: '',
    },
]
export default function TeachingGame() {
    const [activeItem, setActiveItem] = useState(null);
    const [gameKind, setGameKind] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [totalPages, setTotalPages] = useState(Math.ceil(games.filter(g => g.type == gameKind).length / itemsPerPage));
    const [showNavigation, setShowNavigation] = useState(false);
    const [filterData, setFilterData] = useState({});
    const [fitleredGames, setFtitleredGames] = useState(games);
    useEffect(()=>{
        setTotalPages(Math.ceil(fitleredGames.filter(g => g.type == gameKind).length / itemsPerPage));
        setFilterData((prev)=>{
            return {
                ...prev,
                type: gameKind,
            }
        })
    },[gameKind])
    useEffect(()=>{
        if(filterData?.search?.length == 0){
            setFtitleredGames(games)
        }   
    },[filterData])
    useEffect(() => {
        setCurrentPage(0);
        setTotalPages(Math.ceil(fitleredGames.filter(g => g.type == gameKind).length / itemsPerPage));
    },[fitleredGames])
    const search = () => {
        if(filterData?.search.length > 0){
            const result = games.filter(g => g.type === filterData.type && g.name.includes(filterData.search));
            setFtitleredGames(result);
        }
    }
    return (
        <div className={styles.body}>
            <Header/>
            <div className={styles.mainContent}>
                <div className={styles.filterArea}>
                    <div className={styles.gameKind}>
                        <input onChange={(e)=>setFilterData((prev)=>{return {...prev,search: e.target.value}})} placeholder='Tên trò chơi' className={styles.searcGameInput}></input>
                        <div onClick={()=>search()} className={styles.searchGameButton}>
                            <span className="material-symbols-outlined">search</span>
                        </div>
                    </div>
                    {ListGameTypes.map(k => (
                        <div onClick={()=>setGameKind(k.id)} className={styles.gameKind}>
                            {k.name}
                        </div>
                    ))}
                </div>
                <div className={styles.contentArea}>
                    {fitleredGames?.filter(g => g.type == gameKind)
                        .slice((currentPage) * itemsPerPage, (currentPage + 1) * itemsPerPage)
                        .map(g => (
                            <div onMouseEnter={()=>setActiveItem(g.id)} onMouseLeave={()=>setActiveItem(null)} className={styles.game}>
                                <Image width={360} height={300} className={styles.gameImage} src={g.img}/>
                                {activeItem == g.id && (
                                    <div className={styles.gameDes}>
                                        <div className={styles.gameTittle}>
                                            {g.name}
                                        </div>
                                        <div className={styles.gameDescription}>
                                            {g.des}
                                        </div>
                                        <div  className={styles.gameDownLoad}>
                                            Tải về
                                        </div>
                                    </div>
                                )}
                            </div>
                    ))}
                    <div className={styles.pagination}>
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            handlePageChange={(e)=>setCurrentPage(e.selected)}
                        />
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}