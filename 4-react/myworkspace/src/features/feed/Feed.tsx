import { useRef, useState } from "react";

import produce from "immer";
// import { iteratorSymbol } from "immer/dist/internal";
import FeedEditModal from "./FeedEditModal";
// ./type.ts/js/tsx가 없으면, ./type/index.ts/js/tsx 로딩함
import { FeedState } from "./type";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import style from "./Feed.module.scss";

// // 날짜/시간
const getTimeString = (unixtime: number) => {
  const dateTime = new Date(unixtime);
  return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
};

const Feed = () => {
  const profile = useSelector((state: RootState) => state.profile);

  //state 생성
  const [feedList, setFeedList] = useState<FeedState[]>([]);

  const formRef = useRef<HTMLFormElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // 팝업 띄울지말지
  const [isEdit, setIsEdit] = useState(false);

  const add = () => {
    // file가 있어도, 선택을 안하면 length는 0
    // 1. 파일 로딩
    if (fileRef.current?.files?.length) {
      const file = fileRef.current?.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // 2. 피드추가
        const feed: FeedState = {
          id: feedList.length > 0 ? feedList[0].id + 1 : 1,
          username: profile.username,
          image: profile.image,
          memo: textRef.current?.value,
          createTime: new Date().getTime(),
          dataUrl: reader.result?.toString(),
          fileType: reader.result?.toString(),
        };

        // immer 사용 안함
        // setFeedList([feed, ...feedList]);

        // immer 사용
        setFeedList(
          produce((state) => {
            state.unshift(feed);
          })
        );
        // 입력값 초기화
        formRef.current?.reset();
      };
    }
  };

  const del = (id: number) => {
    // immer 사용안함
    // setFeedList(feedList.filter((item) => item.id ! == id));

    // immer 사용
    setFeedList(
      produce((state) => {
        const item = state.find((item) => item.id === id);
        if (item) {
          state.splice(state.indexOf(item), 1);
        }
      })
    );
  };

  // 컴포넌트가 업데이트 되도 유지시킬 수 있는 변수
  // 수정할 Feed객체
  const editItem = useRef<FeedState>({
    id: 0,
    memo: "",
    username: "",
    image: "",
    createTime: 0,
    dataUrl: "",
    fileType: "",
  });

  // 수정
  const edit = (item: FeedState) => {
    // 수정할 feed객체
    editItem.current = item;
    // 모달 팝업을 보여주기
    setIsEdit(true);
  };

  // 저장
  const save = (editItem: FeedState) => {
    console.log(editItem);
    setFeedList(
      produce((state) => {
        const item = state.find((item) => item.id === editItem.id);
        if (item) {
          // FeedEditMomal 자식컴포넌트에서 event-up 할것들
          item.memo = editItem.memo;
          item.dataUrl = editItem.dataUrl;
          item.createTime = editItem.createTime;
          item.fileType = editItem.fileType;
        }
      })
    );
    // 모달창 닫기
    setIsEdit(false);
  };
  return (
    <div style={{ width: "40vw" }} className="mx-auto">
      <h2 className="text-center my-5">Feed</h2>
      {isEdit && (
        <FeedEditModal
          item={editItem.current}
          // 콜백함수
          onClose={() => {
            setIsEdit(false);
          }}
          onSave={(editItem) => {
            save(editItem);
          }}
        />
      )}
      <form
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault();
        }}
        ref={formRef}
      >
        <textarea
          className="form-control mb-1 w-100"
          placeholder="Leave a post here"
          style={{ height: "10vh" }}
          ref={textRef}
        ></textarea>
        <div className="d-flex">
          <input
            type="file"
            className="form-control me-1"
            accept="image/png, image/jpeg, video/mp4"
            ref={fileRef}
          />
          <button
            className="btn btn-primary text-nowrap"
            type="button"
            onClick={() => {
              add();
            }}
          >
            입력
          </button>
        </div>
      </form>
      <div className="mt-3 mb-3">
        {feedList.map((item) => (
          <div className="card mt-1" key={item.id}>
            <div className="card-header d-flex">
              <div
                className={`${style["feed-thumb"]} me-1`}
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <span className={`${style["feed-username"]}`}>
                {item.username}
              </span>
            </div>
            {item.fileType &&
              (item.fileType?.includes("image") ? (
                <img
                  src={item.dataUrl}
                  className="card-img-top"
                  alt={item.memo}
                />
              ) : (
                <video className="card-img-top" controls>
                  <source src={item.dataUrl} type="video/mp4"></source>
                </video>
              ))}

            <div className="card-body">
              <p className="card-text">{item.memo}</p>
              <div className="d-flex">
                <div className="w-100">
                  <span style={{ fontSize: "0.75rem" }}>
                    {getTimeString(item.createTime)}
                  </span>
                </div>
                <a
                  href="#!"
                  onClick={() => {
                    // 수정 모달 팝업 띄우고 데이터 객체 넘겨주기
                    edit(item);
                  }}
                  className="link-secondary text-nowrap me-2"
                >
                  수정
                </a>
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    del(item.id);
                  }}
                  className="link-secondary text-nowrap"
                >
                  삭제
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
