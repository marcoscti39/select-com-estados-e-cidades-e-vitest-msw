import React, { MouseEventHandler } from "react";
import InputSelectOption from "./InputSelectOption";

export interface BrasilStatesTypes {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
}

export interface StateDDDTypes {
  AC: string[];
  AL: string[];
  AM: string[];
  AP: string[];
  BA: string[];
  CE: string[];
  DF: string[];
  ES: string[];
  GO: string[];
  MA: string[];
  MG: string[];
  MS: string[];
  MT: string[];
  PA: string[];
  PB: string[];
  PE: string[];
  PI: string[];
  PR: string[];
  RJ: string[];
  RN: string[];
  RO: string[];
  RR: string[];
  RS: string[];
  SC: string[];
  SE: string[];
  SP: string[];
  TO: string[];
}

const options = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const App = () => {
  const [isStateOptionsOpen, setIsStateOptionsOpen] = React.useState(false);
  const [isCityOptionsOpen, setIsCityOptionsOpen] = React.useState(false);
  const [stateFilterInput, setStateFilterInput] = React.useState("");
  const [cityFilterInput, setCityFilterInput] = React.useState("");

  const [brasilStates, setBrasilStates] = React.useState<BrasilStatesTypes[]>(
    []
  );
  const [statesDDD, setStatesDDD] = React.useState<StateDDDTypes>(
    {} as StateDDDTypes
  );

  const [brasilStateCities, setBrasilStateCities] = React.useState(
    [] as string[]
  );

  React.useEffect(() => {
    if (stateFilterInput.length > 0) {
      setIsStateOptionsOpen(true);
    }
  }, [stateFilterInput]);

  React.useEffect(() => {
    if (cityFilterInput.length > 0) {
      setIsCityOptionsOpen(true);
    }
  }, [cityFilterInput]);

  React.useEffect(() => {
    const getBrasilStates = async () => {
      try {
        const response = await fetch("https://brasilapi.com.br/api/ibge/uf/v1");
        const data = await response.json();
        setBrasilStates(data);
      } catch (e) {
        console.log(e);
      }
    };
    const getStatesDDD = async () => {
      try {
        const response = await fetch("stateDDDs.json", options);
        const data = await response.json();
        setStatesDDD(data);
      } catch (e) {
        console.log(e);
      }
    };
    getBrasilStates();
    getStatesDDD();
  }, []);

  const getStateSelectedDDD = (stateInitials: string, stateName: string) => {
    setStateFilterInput(stateName);
    setIsStateOptionsOpen(false);

    const stateDDD = statesDDD[stateInitials as keyof StateDDDTypes];

    setBrasilStateCities([]);

    stateDDD.forEach((DDD) => getCitiesOfSelectedState(DDD, stateInitials));
  };

  const getCitiesOfSelectedState = async (
    stateDDD: string,
    stateInitials: string
  ) => {
    try {
      const response = await fetch(
        `https://brasilapi.com.br/api/ddd/v1/${stateDDD}`
      );
      const data = await response.json();
      if (data.state !== stateInitials) {
        setBrasilStateCities(data.cities);
        return;
      }
      setBrasilStateCities((previousState) => [
        ...previousState,
        ...data.cities,
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container">
      <div className="input-select-container">
        <div>
          <input
            type="search"
            name=""
            id=""
            className="input-filter"
            value={stateFilterInput}
            onChange={(e) => setStateFilterInput(e.target.value)}
            placeholder="selecione seu estado"
            autoFocus
          />
          <button
            className="btn-open-options"
            onClick={() => setIsStateOptionsOpen(!isStateOptionsOpen)}
          >
            ^
          </button>
        </div>
        <div
          className={`option-container ${isStateOptionsOpen && "show-options"}`}
          role="complementary"
        >
          {brasilStates
            ?.filter((state) =>
              state.nome.toLowerCase().includes(stateFilterInput.toLowerCase())
            )
            .map((state, index) => (
              <InputSelectOption
                key={index}
                stateAbb={state.sigla}
                onClick={(e) =>
                  getStateSelectedDDD(
                    e.currentTarget.dataset.stateAbb!,
                    e.currentTarget.textContent!
                  )
                }
              >
                {state.nome}
              </InputSelectOption>
            ))}
        </div>
      </div>

      <div className="input-select-container">
        <div>
          <input
            type="search"
            name=""
            id=""
            className="input-filter"
            value={cityFilterInput}
            onChange={(e) => setCityFilterInput(e.target.value)}
            placeholder="selecione sua cidade"
            disabled={brasilStateCities.length === 0 ? true : false}
          />
          <button
            className="btn-open-options"
            onClick={() => setIsCityOptionsOpen(!isCityOptionsOpen)}
            disabled={brasilStateCities.length === 0 ? true : false}
          >
            ^
          </button>
        </div>
        <div
          className={`option-container ${isCityOptionsOpen && "show-options"}`}
          role="complementary"
        >
          {brasilStateCities
            ?.filter((city) =>
              city.toLowerCase().includes(cityFilterInput.toLowerCase())
            )
            .map((city, index) => (
              <InputSelectOption key={index} stateAbb={city}>
                {city}
              </InputSelectOption>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
