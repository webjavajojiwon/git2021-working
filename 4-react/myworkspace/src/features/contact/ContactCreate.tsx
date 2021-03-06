import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { requestAddContact } from "./contactSaga";
import { ContactItem } from "./contactSlice";

const ContactCreate = () => {
  // input ref객체
  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputPhoneRef = useRef<HTMLInputElement>(null);
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const memoTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // 데이터배열 가져오기
  const contactData = useSelector((state: RootState) => state.contact.data);
  // 1. state 변경감지 및 값 가져오기
  const isAddCompleted = useSelector(
    (state: RootState) => state.contact.isAddCompleted
  );

  // dispatch 함수 만들기
  const dispatch = useDispatch<AppDispatch>();

  // 히스토리 객체 가져오기
  const history = useHistory();

  // 2. state 변경되면 처리되는 함수
  useEffect(() => {
    // true일때 화면이동
    isAddCompleted && history.push("/contacts");
  }, [isAddCompleted, history, dispatch]);

  // add 함수
  const handleAddClick = () => {
    // 입력값 확인하기
    // console.log(inputNameRef.current?.value);
    // console.log(inputPhoneRef.current?.value);
    // console.log(inputEmailRef.current?.value);
    // console.log(memoTextAreaRef.current?.value);

    // 추가 객체 생성
    const item: ContactItem = {
      // 기존데이터의 id중에 가장 큰 것 + 1
      id: contactData.length > 0 ? contactData[0].id + 1 : 1,
      name: inputNameRef.current ? inputNameRef.current.value : "",
      phone: inputPhoneRef.current ? inputPhoneRef.current.value : "",
      email: inputEmailRef.current ? inputEmailRef.current.value : "",
      memo: memoTextAreaRef.current ? memoTextAreaRef.current.value : "",
      createdTime: new Date().getTime(),
    };

    // 입력 item값 확인하기
    // console.log(item);

    // 목록화면으로 이동
    // history.push("/contacts");

    // state에 데이터 추가하기
    // dispatch(addContact(item));

    // saga action
    dispatch(requestAddContact(item));
  };

  return (
    <div className="mx-auto" style={{ width: "40vw" }}>
      <h2 className="text-center my-5">Contact Create</h2>
      <form>
        <table className="table">
          <tbody>
            <tr>
              <th>이름</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  ref={inputNameRef}
                />
              </td>
            </tr>
            <tr>
              <th>전화번호</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  ref={inputPhoneRef}
                />
              </td>
            </tr>
            <tr>
              <th>이메일</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  ref={inputEmailRef}
                />
              </td>
            </tr>
            <tr>
              <th>메모</th>
              <td>
                <textarea
                  className="form-control"
                  style={{ height: "30vh" }}
                  ref={memoTextAreaRef}
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <div>
        <button
          className="btn btn-secondary text-nowrap float-start"
          onClick={() => {
            history.push("/contacts");
          }}
        >
          <i className="bi bi-list-ul me-1" />
          목록
        </button>
        <button
          className="btn btn-primary text-nowrap float-end"
          onClick={() => {
            handleAddClick();
          }}
        >
          <i className="bi bi-check me-1" />
          저장
        </button>
      </div>
    </div>
  );
};

export default ContactCreate;
