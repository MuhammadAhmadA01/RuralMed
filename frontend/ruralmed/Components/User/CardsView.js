import { ScrollView,View } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
const CardsView=({role,inProgressOrders,currentMonthEarning,currentMonthOrders,prevMonthEarning,prevMonthOrders})=>{
  
  return  <ScrollView contentContainerStyle={{ padding: 16 }}>
    <Card style={{ marginBottom: 16, flex: 1, height: 130 }}>
      <Card.Content>
        <Title
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20,
            color: "black",
          }}
        >
          Current Month Earning
        </Title>
        <Paragraph style={{ textAlign: "center", fontSize: 20 }}>
          {currentMonthEarning}
        </Paragraph>
      </Card.Content>
    </Card>
    <Card style={{ marginBottom: 16, flex: 1, height: 130 }}>
      <Card.Content>
        <Title
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20,
            color: "black",
          }}
        >
         {  role==='Dvm'?'Current Month Meetings':'Current Month Orders'}
        </Title>
        <Paragraph style={{ textAlign: "center", fontSize: 20 }}>
          { currentMonthOrders}
        </Paragraph>
      </Card.Content>
    </Card>
    <Card style={{ marginBottom: 16, flex: 1, height: 130 }}>
      <Card.Content>
        <Title
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20,
            color: "black",
          }}
        >
         {  role==='Dvm'?'Scheduled Meetings':'In Progress Orders'}

        </Title>
        <Paragraph style={{ textAlign: "center", fontSize: 20 }}>
          { inProgressOrders}
        </Paragraph>
      </Card.Content>
    </Card>
    <Card style={{ marginBottom: 16, flex: 1, height: 130 }}>
      <Card.Content>
        <Title
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20,
            color: "black",
          }}
        >
          Prev Month Earning
        </Title>
        <Paragraph style={{ textAlign: "center", fontSize: 20 }}>
          { prevMonthEarning}
        </Paragraph>
      </Card.Content>
    </Card>
    <Card style={{ marginBottom: 16, flex: 1, height: 130 }}>
      <Card.Content>
        <Title
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20,
            color: "black",
          }}
        >
         {  role==='Dvm'?'Prev Month Meetings':'Prev Month Orders'}

        </Title>
        <Paragraph style={{ textAlign: "center", fontSize: 20 }}>
          { prevMonthOrders}
        </Paragraph>
      </Card.Content>
    </Card>
  </ScrollView>

}
export default CardsView;