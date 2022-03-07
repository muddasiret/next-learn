import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetingDetails = (props) => {
  return (
    <>
      <Head>
        <title>{props.details.title}</title>
        <meta name="description" content={props.details.description} />
        <meta property="og:image" content={props.details.image} key="ogimage" />
      </Head>
      <p>{props.details._id}</p>
      <MeetupDetail
        image={props.details.image}
        title={props.details.title}
        address={props.details.address}
        description={props.details.description}
      />
    </>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://mudu:mongodbpass009@cluster0.81qtu.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();

  return {
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    "mongodb+srv://mudu:mongodbpass009@cluster0.81qtu.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });
  client.close();
  console.log(selectedMeetup);
  return {
    props: {
      details: { ...selectedMeetup, _id: meetupId },
    },
  };
}

export default MeetingDetails;
