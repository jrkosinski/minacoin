#ifndef __TRANSACTION_H__
#define __TRANSACTION_H__

#include "../inc.h"
#include "../blockchain/iblockdataitem.hpp" 
#include "../util/crypto/keypair.hpp"
#include "../loggingobj.hpp"

using namespace minacoin::util::crypto; 

namespace minacoin::wallet {
	
	//input to transaction 
	struct TxInput {
		uint timestamp;
		float amount; 
		string address; 
		string signature;
	}; 

	//output from transaction 
	struct TxOutput {
		float amount; 
		string address; 
	};
	
	class Transaction: public minacoin::blockchain::IBlockDataItem, LoggingObj {
		private: 
			string _id; 
			TxInput _input;
			vector<TxOutput> _outputRecip; 
			TxOutput _outputSelf;
		
		//public properties 
		public:
			string id() const override { return _id; };
			uint timestamp() const { return _input.timestamp; }
			TxInput input() const { return _input; }
			string sender() const { return _input.address; }
			const vector<TxOutput>& outputRecip() const { return _outputRecip; }
			TxOutput outputSelf() const { return _outputSelf; }
			float inputAmount() const { return _input.amount; }
			float totalOutput() const { return this->outputAmount() + _outputSelf.amount; }
			float outputAmount() const { 
				float sum = 0; 
				
				//TODO: some kind of sum operation here 
				for(auto it = _outputRecip.begin(); it!= _outputRecip.end(); ++it) {
					sum += it->amount;
				}
				return sum;
			}
			
		//constructors/destructors
		public: 
			Transaction();
			~Transaction(); 
		
		//public instance methods 
		public: 
			Transaction* update(const string& sender, const string& recipient, float senderBalance, float amount); 
			void sign(const minacoin::util::crypto::KeyPair* keyPair); 
			bool verify() const;  
			
		//public static methods 
		public: 
			static Transaction* create(const string& sender, const string& recipient, float senderBalance, float amount);
			static Transaction* reward(const string& minerAddress, const string& bcAddress); 
			static Transaction* createFromJson(const string& json);
			
		//IBlockDataItem overrides
		public: 
			virtual string toJson() const override; 
			virtual void fromJson(const string& json) override;
			virtual bool equals(const IBlockDataItem* item) const override;
			virtual bool equals(const IBlockDataItem& item) const override;
			
		//equality
		public:
			bool equals(const Transaction* tx) const;
			bool equals(const Transaction& tx) const;
			bool dataEquals(const Transaction* tx) const;
			bool dataEquals(const Transaction& tx) const;
			
		//testing only 
		#ifdef __UNIT_TESTS__ 
		public: 
			void updateInput(float amount) { this->updateInput(_input.address, amount); }
			void updateInput(string address, float amount) { 
				_input.address = address; 
				_input.amount = amount; 
			} 
			void updateOutputRecip(size_t index, float amount) { this->updateOutputRecip(index, _outputRecip.at(index).address, amount); } 
			void updateOutputRecip(size_t index, string address, float amount) { 
				_outputRecip.at(index).address = address; 
				_outputRecip.at(index).amount = amount; 
			}  
			void updateOutputSelf(float amount) { this->updateOutputSelf(_outputSelf.address, amount); } 
			void updateOutputSelf(string address, float amount) { 
				_outputSelf.address = address; 
				_outputSelf.amount = amount; 
			} 
		#endif
			
		//private methods
		private: 
			string serializeOutputs() const;
			string serializeInput() const;
			void configure(const string& sender, const string& recipient, float inputAmount, float outputAmount);
			static bool inputsEqual(const TxInput& a, const TxInput& b); 
			static bool outputsEqual(const TxOutput& a, const TxOutput& b);
	}; 
}

#endif
