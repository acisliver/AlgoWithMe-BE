import Chatroom from "./components/chatroom";
import Console from "./components/console";
import Editor from "./components/editor";
import FileExplorer from "./components/file_explorer";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Modal from "./components/modal";

import React, { useEffect, useState } from "react";
import axiosInstance from "../../service/axiosInstance";
import * as projectService from '../../service/projectService'

const index = () => {
  const [onModalClick, setOnModalClick] = useState(true);
  const [modal, setModal] = React.useState(false);
  const [projectStructure, setProjectStructure] = React.useState([]);

  const projectBtnHandler = (isOn) => {
    setOnModalClick(isOn);
  };

  const createModal = () => {
    setModal((prev) => !prev);
  };
  const handlePjtClick= async(projectId)=>{
    try {
      const response = await projectService.getProjectStructure(projectId);
      if(response.success){
        setProjectStructure(response.data)
        projectBtnHandler(false)
      }else{
       console.error(response.error);
      }  
    } catch (error) {
      console.error(error)
    } 
}

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("projects");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
    fetchUserData();
  }, []);

  //버튼 클릭 시 크기 조절
  const [editorHeight, setEditorHeight] = useState("60vh");
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);
  const [isTabFilesVisible, setIsTabFilesVisible] = useState(false);
  const [editorWidth, setEditorWidth] = useState("100%");

  useEffect(() => {
    if (isTabFilesVisible) {
      setEditorWidth("100%");
    } else {
      setEditorWidth("100%");
    }
  }, [isTabFilesVisible]);

  const toggleConsoleVisibility = () => {
    setIsConsoleVisible(prev => !prev);
    setEditorHeight(isConsoleVisible ? "96vh" : "60vh");
  };

  return (
    <div>

      {onModalClick && (
        <Modal
          onProjClick={projectBtnHandler}
          modal={modal}
          setModal={setModal}
          createModal={createModal}
          handlePjtClick={handlePjtClick}
          user={user} // 사용자 데이터를 prop으로 전달
        />
      )}
      <div className="flex flex-col h-screen relative">
        <Header onProjClick={projectBtnHandler} />
        <div className="flex flex-row w-full h-full">
          <div className="flex flex-row">
            <Sidebar
              createModal={createModal}
              projectBtnHandler={projectBtnHandler}
              projectStructure={projectStructure}
              toggleConsoleVisibility={toggleConsoleVisibility}
              setTabFilesVisible={setIsTabFilesVisible}
              isConsoleVisible={isConsoleVisible}
            />
            <FileExplorer />
          </div>
          <div className="flex flex-col w-full h-full">
            <Editor editorHeight={editorHeight} editorWidth={editorWidth} />
            <Console isVisible={isConsoleVisible} toggleConsoleVisibility={toggleConsoleVisibility} />
          </div>
        </div>
        <Chatroom className="absolute bottom-0 right-0 z-50" userName={"이곳에 유저 이름을 입력"}/>
      </div>
    </div>
  );
};

export default index;
