import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { requestDeleteContact } from "./contactSaga";

const ContactDetail = () => {
  // useParam<타입>(), 매개변수들을 객체화할 형식을 제너릭으로 넣어줌
  // 객체의 속성명하고 선언할 변수명이 같으면 { id } 로 쓸수 있다.
  const { id } = useParams<{ id: string }>();

  const contactItem = useSelector((state: RootState) =>
    state.contact.data.find((item) => item.id === +id)
  ); // 반환형식을 타입 추론으로 처리
  // ) as contactItem 타입 단언 (type assertion)

  // 1. state 삭제 여부 감지 및 가져오기
  const isDeleteCompleted = useSelector(
    (state: RootState) => state.contact.isDeleteCompleted
  );

  // dispatch 함수 만들기
  const dispatch = useDispatch<AppDispatch>();

  // 히스토리 객체 가져오기
  const history = useHistory();

  // 2. state 변경되면 처리되는 함수
  useEffect(() => {
    isDeleteCompleted && history.push("/contacts");
  }, [isDeleteCompleted, history]);

  const handDeleteClick = () => {
    // saga action
    dispatch(requestDeleteContact(+id));
    // id값만 삭제
    // dispatch(delContact(+id));
    // 목록으로 이동
    // history.push("/contacts");
  };

  return (
    <div style={{ width: "40vw" }} className="mx-auto">
      <h2 className="text-center my-5">Contact Detail</h2>
      <table className="table">
        <tbody>
          <tr>
            <th>이름</th>
            <td>{contactItem?.name}</td>
          </tr>
          <tr>
            <th>전화번호</th>
            <td>{contactItem?.phone}</td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>{contactItem?.email}</td>
          </tr>
          <tr>
            <th>메모</th>
            <td
              dangerouslySetInnerHTML={{
                __html: contactItem?.memo
                  ? contactItem.memo.replaceAll("\n", "<br>")
                  : "",
              }}
            ></td>
          </tr>
        </tbody>
      </table>
      <div className="d-flex">
        <div style={{ width: "50%" }}>
          <button
            className="btn btn-secondary text-nowrap"
            onClick={() => {
              history.push("/contacts");
            }}
          >
            <i className="bi bi-list-ul me-1" />
            목록
          </button>
        </div>
        <div style={{ width: "50%" }} className="d-flex justify-content-end">
          <button
            className="btn btn-primary text-nowrap me-1"
            onClick={() => {
              history.push(`/contacts/edit/${id}`);
            }}
          >
            <i className="bi bi-pencil me-1" />
            수정
          </button>
          <button
            className="btn btn-danger text-nowrap"
            onClick={() => {
              handDeleteClick();
            }}
          >
            <i className="bi bi-trash me-1" />
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
