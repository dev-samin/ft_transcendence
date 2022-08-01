import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { myDataState } from 'utils/recoil/myData';
import { errorState } from 'utils/recoil/error';
import instance from 'utils/axios';
import styles from 'styles/login/login.module.css';
import 'styles/login/SecondAuth.css';

function SecondAuth() {
  const [myData, setMyData] = useRecoilState(myDataState);
  const [emailInput, setEmailInput] = useState<string>('');
  const [codeInput, setCodeInput] = useState<string>('');
  const setErrorMessage = useSetRecoilState(errorState);

  const sendEmail = async () => {
    try {
      await instance.post(`/oauth/sendEmail?id=${myData.nickName}`, {
        email: emailInput,
      });
    } catch (e) {
      setErrorMessage('SA01');
    }
  };

  const submitCode = async () => {
    try {
      const res = await instance.post(
        `/oauth/validEmail?id=${myData.nickName}`,
        {
          code: codeInput,
        }
      );
      setMyData(res?.data);
    } catch (e: any) {
      if (e.response.data.statusCode === 'SC01') alert('잘못된 코드입니다.');
      else setErrorMessage('SA02');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className='secondAuthTitle'>2차 인증을 완료해주세요.</div>
      <div className={styles.innerContainer}>
        <div className='submitFrame'>
          <label className='submitLabel'>email</label>
          <input
            className='submitInput'
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <button className='submitButton' onClick={sendEmail}>
            발송
          </button>
        </div>
        <div className='submitFrame'>
          <label className='submitLabel'>코드</label>
          <input
            className='submitInput'
            onChange={(e) => setCodeInput(e.target.value)}
          />
          <button className='submitButton' onClick={submitCode}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default SecondAuth;
