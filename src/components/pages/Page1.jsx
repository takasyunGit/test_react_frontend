import styled from "styled-components"

// テスト
const StyledDiv = styled.div`
  padding: "8px";
`;

// ここまで
export const Page1 = () => {
  return(
    <div>
      <h1>Page1</h1>
      <StyledDiv>
        <p>このように</p>
      </StyledDiv>
    </div>
  );
};
export default Page1;